import { InboxEventEntity } from '@nz/shared-domain';
import { InboxEventEntityORM } from '../entities';

export class InboxEventMapper {
  static toDomain(inboxEvent: InboxEventEntityORM): InboxEventEntity {
    return InboxEventEntity.restore({
      id: inboxEvent.id,
      aggregateId: inboxEvent.aggregateId,
      aggregateType: inboxEvent.aggregateType,
      availableAt: inboxEvent.availableAt,
      eventScope: inboxEvent.eventScope,
      eventType: inboxEvent.eventType,
      eventVersion: inboxEvent.eventVersion,
      maxRetryAttempts: inboxEvent.maxRetryAttempts,
      payload: inboxEvent.payload,
      priority: inboxEvent.priority,
      processingAttempts: inboxEvent.processingAttempts,
      receivedAt: inboxEvent.receivedAt,
      status: inboxEvent.status,
      causationId: inboxEvent.causationId,
      correlationId: inboxEvent.correlationId,
      createdByService: inboxEvent.createdByService,
      createdByUserId: inboxEvent.createdByUserId,
      errorDetails: inboxEvent.errorDetails,
      expiresAt: inboxEvent.expiresAt,
      lastErrorAt: inboxEvent.lastErrorAt,
      lastErrorCode: inboxEvent.lastErrorCode,
      lastErrorMessage: inboxEvent.lastErrorMessage,
      lockedAt: inboxEvent.lockedAt,
      messageId: inboxEvent.messageId,
      metadata: inboxEvent.metadata,
      originalEventId: inboxEvent.originalEventId,
      payloadSchemaVersion: inboxEvent.payloadSchemaVersion,
      processedAt: inboxEvent.processedAt,
      processorId: inboxEvent.processorId,
      sourceTenantId: inboxEvent.sourceTenantId,
      targetTenantId: inboxEvent.targetTenantId,

      createdAt: inboxEvent.createdAt,
      updatedAt: inboxEvent.updatedAt,
    });
  }

  static toPersistence(inboxEvent: InboxEventEntity): Partial<InboxEventEntityORM> {
    return {
      id: inboxEvent.id,
      aggregateId: inboxEvent.aggregateId,
      aggregateType: inboxEvent.aggregateType,
      availableAt: inboxEvent.availableAt,
      eventScope: inboxEvent.eventScope,
      eventType: inboxEvent.eventType,
      eventVersion: inboxEvent.eventVersion,
      maxRetryAttempts: inboxEvent.maxRetryAttempts,
      payload: inboxEvent.payload,
      priority: inboxEvent.priority,
      processingAttempts: inboxEvent.processingAttempts,
      receivedAt: inboxEvent.receivedAt,
      status: inboxEvent.status,
      causationId: inboxEvent.causationId,
      correlationId: inboxEvent.correlationId,
      createdByService: inboxEvent.createdByService,
      createdByUserId: inboxEvent.createdByUserId,
      errorDetails: inboxEvent.errorDetails,
      expiresAt: inboxEvent.expiresAt,
      lastErrorAt: inboxEvent.lastErrorAt,
      lastErrorCode: inboxEvent.lastErrorCode,
      lastErrorMessage: inboxEvent.lastErrorMessage,
      lockedAt: inboxEvent.lockedAt,
      messageId: inboxEvent.messageId,
      metadata: inboxEvent.metadata,
      originalEventId: inboxEvent.originalEventId,
      payloadSchemaVersion: inboxEvent.payloadSchemaVersion,
      processedAt: inboxEvent.processedAt,
      processorId: inboxEvent.processorId,
      sourceTenantId: inboxEvent.sourceTenantId,
      targetTenantId: inboxEvent.targetTenantId,

      createdAt: inboxEvent.createdAt,
      updatedAt: inboxEvent.updatedAt,
    };
  }
}
