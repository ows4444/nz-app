import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, ENVIRONMENT_ENV } from '@nz/config';
import { InboxEventEntity, OutboxEventEntity } from '@nz/shared-domain';
import { TypeormInboxEventRepository } from '@nz/shared-infrastructure';
import { Channel, ConsumeMessage } from 'amqplib';
@Injectable()
export class InboxService implements OnModuleInit {
  private channel!: Channel;

  constructor(private readonly amqpConnection: AmqpConnection, private readonly configService: ConfigService, private inboxRepo: TypeormInboxEventRepository) {}

  async onModuleInit() {
    this.channel = this.amqpConnection.channel;

    await this.channel.assertExchange('events', 'topic', { durable: true });

    const serviceName = this.configService.getOrThrow<Environment>(ENVIRONMENT_ENV).appName;

    const q = await this.channel.assertQueue(`${serviceName}.events`, {
      durable: true,
    });

    await this.channel.bindQueue(q.queue, 'events', serviceName);

    await this.channel.consume(q.queue, this.handleMessage.bind(this), { noAck: false });
  }

  private async handleMessage(msg: ConsumeMessage | null) {
    if (!msg) {
      return;
    }

    try {
      const payload: OutboxEventEntity = JSON.parse(msg.content.toString());
      const inboxEvent = InboxEventEntity.createNew(payload.eventScope, payload.aggregateType, payload.aggregateId, payload.eventType, payload.eventVersion, payload.payload, {
        metadata: payload.metadata,
        availableAt: payload.availableAt,
        causationId: payload.causationId,
        correlationId: payload.correlationId,
        createdByService: payload.createdByService,
        createdByUserId: payload.createdByUserId,
        expiresAt: payload.expiresAt,
        maxRetryAttempts: payload.maxRetryAttempts,
        messageId: payload.messageId,
        originalEventId: payload.id,
        payloadSchemaVersion: payload.payloadSchemaVersion,
        priority: payload.priority,
        requiresOrdering: payload.requiresOrdering,
        sequenceNumber: payload.sequenceNumber,
        sourceTenantId: payload.sourceTenantId,
        targetTenantId: payload.targetTenantId,
      });
      await this.inboxRepo.save(inboxEvent);

      console.log('Received user-service event:', payload);
      this.channel.ack(msg);
    } catch (err) {
      console.error('Failed to process message', err);
      this.channel.nack(msg, false, false);
    }
  }
}
