import { EventProcessingMetricsEntity } from '@nz/shared-domain';
import { EventProcessingMetricsEntityORM } from '../entities';

export class EventProcessingMetricsMapper {
  static toDomain(eventSubscription: EventProcessingMetricsEntityORM): EventProcessingMetricsEntity {
    return EventProcessingMetricsEntity.restore({
      id: eventSubscription.id,
      tenantId: eventSubscription.tenantId,
      eventType: eventSubscription.eventType,
      eventSource: eventSubscription.eventSource,
      dateHour: eventSubscription.dateHour,
      totalEvents: eventSubscription.totalEvents,
      processedEvents: eventSubscription.processedEvents,
      failedEvents: eventSubscription.failedEvents,
      avgProcessingTimeMs: eventSubscription.avgProcessingTimeMs,
      createdAt: eventSubscription.createdAt,
      updatedAt: eventSubscription.updatedAt,
    });
  }

  static toPersistence(eventSubscription: EventProcessingMetricsEntity): Partial<EventProcessingMetricsEntityORM> {
    return {
      id: eventSubscription.id,
      tenantId: eventSubscription.tenantId,
      eventType: eventSubscription.eventType,
      eventSource: eventSubscription.eventSource,
      dateHour: eventSubscription.dateHour,
      totalEvents: eventSubscription.totalEvents,
      processedEvents: eventSubscription.processedEvents,
      failedEvents: eventSubscription.failedEvents,
      avgProcessingTimeMs: eventSubscription.avgProcessingTimeMs,
      createdAt: eventSubscription.createdAt,
      updatedAt: eventSubscription.updatedAt,
    };
  }
}
