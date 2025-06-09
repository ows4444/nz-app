import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TypeormOutboxEventRepository } from '@nz/shared-infrastructure';

@Injectable()
export class OutboxService {
  constructor(private outboxRepo: TypeormOutboxEventRepository) {}

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
