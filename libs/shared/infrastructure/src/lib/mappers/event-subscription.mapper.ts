import { EventSubscriptionEntity } from '@nz/shared-domain';
import { EventSubscriptionEntityORM } from '../entities';

export class EventSubscriptionMapper {
  static toDomain(eventSubscription: EventSubscriptionEntityORM): EventSubscriptionEntity {
    return EventSubscriptionEntity.restore({
      id: eventSubscription.id,
      tenantId: eventSubscription.tenantId,
      eventType: eventSubscription.eventType,
      eventScope: eventSubscription.eventScope,
      subscriberService: eventSubscription.subscriberService,
      filterExpression: eventSubscription.filterExpression,

      isActive: eventSubscription.isActive,
      priority: eventSubscription.priority,
      createdAt: eventSubscription.createdAt,
      updatedAt: eventSubscription.updatedAt,
    });
  }

  static toPersistence(eventSubscription: EventSubscriptionEntity): Partial<EventSubscriptionEntityORM> {
    return {
      id: eventSubscription.id,
      tenantId: eventSubscription.tenantId,
      eventType: eventSubscription.eventType,
      eventScope: eventSubscription.eventScope,
      subscriberService: eventSubscription.subscriberService,
      filterExpression: eventSubscription.filterExpression,
      isActive: eventSubscription.isActive,
      priority: eventSubscription.priority,
      createdAt: eventSubscription.createdAt,
      updatedAt: eventSubscription.updatedAt,
    };
  }
}
