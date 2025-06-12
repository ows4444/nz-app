import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxEventEntity } from '@nz/shared-domain';
import { TypeormOutboxEventRepository } from '@nz/shared-infrastructure';
@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);
  constructor(private outboxRepo: TypeormOutboxEventRepository, private readonly amqpConnection: AmqpConnection) {}

  async publishToAll(event: OutboxEventEntity): Promise<void> {
    try {
      await this.amqpConnection.publish('events.fanout', '', event, {
        persistent: true,
        messageId: event.id,
        timestamp: Date.now(),
      });
      this.logger.log(`Published fanout event: ${event.eventType} from ${event.createdByService} with ID: ${event.id}`);
    } catch (error) {
      this.logger.error('Failed to publish fanout event', error);
      throw error;
    }
  }

  async publishToSpecific(event: OutboxEventEntity, routingKey: string): Promise<void> {
    try {
      await this.amqpConnection.publish('events.topic', routingKey, event, {
        persistent: true,
        messageId: event.id,
        timestamp: Date.now(),
      });
      this.logger.log(`Published topic event: ${event.eventType} with routing key: ${routingKey}`);
    } catch (error) {
      this.logger.error('Failed to publish topic event', error);
      throw error;
    }
  }

  // Send direct event to specific service
  async sendCommand(event: OutboxEventEntity, targetService: string): Promise<void> {
    try {
      await this.amqpConnection.publish('commands.direct', targetService, event, {
        persistent: true,
        messageId: event.id,
        timestamp: Date.now(),
      });
      this.logger.log(`Sent command to ${targetService}: ${event.eventType} with ID: ${event.id}`);
    } catch (error) {
      this.logger.error('Failed to send command', error);
      throw error;
    }
  }

  private determineRoutingKey(event: OutboxEventEntity): string {
    const [domain, _action] = event.eventType.toLowerCase().split('.');

    // Define your routing rules
    const routingRules: Record<string, string> = {
      user: 'user.*',
      order: 'order.*',
      payment: 'payment.* notification.*',
      inventory: 'inventory.* order.*',
      notification: 'notification.*',
    };

    return routingRules[domain] || `${domain}.*`;
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

        if (entry.eventType.includes('GLOBAL_')) {
          // Broadcast to all services
          await this.publishToAll(entry);
        } else {
          // Route to specific services
          const routingKey = this.determineRoutingKey(entry);
          await this.publishToSpecific(entry, routingKey);
        }
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
