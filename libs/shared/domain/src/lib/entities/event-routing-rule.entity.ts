export interface IEventRoutingRuleProps {
  id?: string;
  ruleName: string;
  sourceTenantId?: string;
  eventType: string;
  routingCondition: string;
  targetTenants: string[];
  routingType: 'broadcast' | 'selective' | 'conditional';
  isActive: boolean;
  priority: number;
  createdAt: Date;
}

export class EventRoutingRuleEntity {
  public readonly id!: string;
  private _ruleName: string;
  public readonly sourceTenantId?: string;
  public readonly eventType: string;
  private _routingCondition: string;
  private _targetTenants: string[];
  public readonly routingType: 'broadcast' | 'selective' | 'conditional';
  private _isActive: boolean;
  private _priority: number;
  private _createdAt: Date;

  private constructor(props: IEventRoutingRuleProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this._ruleName = props.ruleName;
    this.sourceTenantId = props.sourceTenantId;
    this.eventType = props.eventType;
    this._routingCondition = props.routingCondition;
    this._targetTenants = props.targetTenants;
    this.routingType = props.routingType;
    this._isActive = props.isActive;
    this._priority = props.priority;
    this._createdAt = props.createdAt;
  }

  public static createNew(props: Omit<IEventRoutingRuleProps, 'createdAt' | 'id'>): EventRoutingRuleEntity {
    const now = new Date();
    return new EventRoutingRuleEntity({
      ...props,
      createdAt: now,
    });
  }

  public static restore(props: IEventRoutingRuleProps): EventRoutingRuleEntity {
    return new EventRoutingRuleEntity(props);
  }

  // ----------------- Getters -----------------

  public get ruleName(): string {
    return this._ruleName;
  }

  public get routingCondition(): string {
    return this._routingCondition;
  }

  public get targetTenants(): string[] {
    return this._targetTenants;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get priority(): number {
    return this._priority;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  // --------------- Business Methods ---------------

  public updateRuleName(newRuleName: string): void {
    this._ruleName = newRuleName;
  }

  public updateRoutingCondition(newCondition: string): void {
    this._routingCondition = newCondition;
  }

  public updateTargetTenants(newTenants: string[]): void {
    this._targetTenants = newTenants;
  }

  public updateIsActive(status: boolean): void {
    this._isActive = status;
  }

  public updatePriority(newPriority: number): void {
    this._priority = newPriority;
  }
}
