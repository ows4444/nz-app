export interface IEventSubscriptionProps {
  id?: string;
  tenantId?: string;
  eventType: string;
  eventScope: 'tenant' | 'global' | 'cross-tenant';
  subscriberService: string;
  filterExpression?: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export class EventSubscriptionEntity {
  public readonly id!: string;
  public readonly tenantId?: string;
  public readonly eventType: string;
  public readonly eventScope: 'tenant' | 'global' | 'cross-tenant';
  public readonly subscriberService: string;
  private _filterExpression?: string;
  private _isActive: boolean;
  public readonly priority: number;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IEventSubscriptionProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.tenantId = props.tenantId;
    this.eventType = props.eventType;
    this.eventScope = props.eventScope;
    this.subscriberService = props.subscriberService;
    this._filterExpression = props.filterExpression;
    this._isActive = props.isActive;
    this.priority = props.priority;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static createNew(props: Omit<IEventSubscriptionProps, 'id' | 'createdAt' | 'updatedAt'>): EventSubscriptionEntity {
    const now = new Date();
    return new EventSubscriptionEntity({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: IEventSubscriptionProps): EventSubscriptionEntity {
    return new EventSubscriptionEntity(props);
  }

  // ----------------- Getters -----------------

  public get isActive(): boolean {
    return this._isActive;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get filterExpression(): string | undefined {
    return this._filterExpression;
  }

  // --------------- Business Methods ---------------

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public updateFilterExpression(newFilter: string): void {
    this._filterExpression = newFilter;
    this._updatedAt = new Date();
  }
}
