import { EventRoutingRuleEntity } from '@nz/shared-domain';
import { EventRoutingRuleEntityORM } from '../entities';

export class EventRoutingRuleMapper {
  static toDomain(eventRoutingRule: EventRoutingRuleEntityORM): EventRoutingRuleEntity {
    return EventRoutingRuleEntity.restore({
      id: eventRoutingRule.id,
      ruleName: eventRoutingRule.ruleName,
      sourceTenantId: eventRoutingRule.sourceTenantId,
      eventType: eventRoutingRule.eventType,
      routingCondition: eventRoutingRule.routingCondition,
      targetTenants: eventRoutingRule.targetTenants,
      routingType: eventRoutingRule.routingType,
      isActive: eventRoutingRule.isActive,
      priority: eventRoutingRule.priority,
      createdAt: eventRoutingRule.createdAt,
    });
  }

  static toPersistence(eventRoutingRule: EventRoutingRuleEntity): Partial<EventRoutingRuleEntityORM> {
    return {
      id: eventRoutingRule.id,
      ruleName: eventRoutingRule.ruleName,
      sourceTenantId: eventRoutingRule.sourceTenantId,
      eventType: eventRoutingRule.eventType,
      routingCondition: eventRoutingRule.routingCondition,
      targetTenants: eventRoutingRule.targetTenants,
      routingType: eventRoutingRule.routingType,
      isActive: eventRoutingRule.isActive,
      priority: eventRoutingRule.priority,
      createdAt: eventRoutingRule.createdAt,
    };
  }
}
