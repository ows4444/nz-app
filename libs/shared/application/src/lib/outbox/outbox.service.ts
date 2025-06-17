import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxEventEntity } from '@nz/shared-domain';
import { TypeormOutboxEventRepository } from '@nz/shared-infrastructure';
@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);
  constructor(private outboxRepo: TypeormOutboxEventRepository, private readonly amqpConnection: AmqpConnection) {}

  async publishToSpecific(event: OutboxEventEntity, serviceName: string): Promise<void> {
    try {
      await this.amqpConnection.publish('events', serviceName, event.toJSON(), {
        persistent: true,
        messageId: event.id,
        timestamp: Date.now(),
      });
      this.logger.log(`Published topic event: ${event.eventType} with routing key: ${serviceName}`);
    } catch (error) {
      this.logger.error('Failed to publish topic event', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async processOutboxEntries(): Promise<void> {
    console.log('Starting outbox processing...');
    const pendingEntries = await this.outboxRepo.findPending(100);
    if (pendingEntries.length === 0) {
      console.log('No pending outbox entries to process');
      return;
    } else {
      console.log(`Found ${pendingEntries.length} pending outbox entries to process`);
    }

    for (const entry of pendingEntries) {
      try {
        entry.markAsProcessing('Processing started');
        await this.outboxRepo.save(entry);

        entry.markAsProcessed();
        await this.outboxRepo.save(entry);

        for (const target of entry.deliveryTargets) {
          try {
            await this.publishToSpecific(entry, target.targetService);
          } catch (error: any) {
            target.lastError = error.message;
          }
        }
        entry.markAsProcessed();
        await this.outboxRepo.save(entry);
      } catch (error) {
        entry.incrementProcessingAttempts();
        if (entry.isMaxAttemptsReached) {
          entry.markAsFailed(`Max attempts reached`);
        }
        await this.outboxRepo.save(entry);
      }
    }
  }
}
