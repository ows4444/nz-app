export type DeliveryTarget = {
  targetService: string;
  targetTenant?: string;
  delivered: boolean;
  deliveredAt?: Date;
  attempts: number;
  lastError?: string;
};

export interface IOutboxEventProps {
  id?: string;
  sourceTenantId?: string;
  targetTenantId?: string;
  eventScope: 'tenant' | 'global' | 'cross-tenant';
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventVersion: string;
  payload: Record<string, unknown>;

  deliveryTargets?: Array<DeliveryTarget>;

  requiresOrdering: boolean;
  sequenceNumber?: number;

  payloadSchemaVersion?: string;
  status: 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying';
  processingAttempts: number;
  maxRetryAttempts: number;
  lastErrorAt?: Date;
  lastErrorMessage?: string;
  lastErrorCode?: string;
  errorDetails?: Record<string, unknown>;
  priority: number;
  availableAt: Date;
  expiresAt?: Date;
  processorId?: string;
  lockedAt?: Date;
  processedAt?: Date;
  correlationId?: string;
  causationId?: string;
  messageId?: string;
  metadata?: Record<string, unknown>;
  createdByUserId?: string;
  createdByService?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OutboxEventEntity {
  public readonly id!: string;
  public readonly sourceTenantId?: string;
  public readonly targetTenantId?: string;
  public readonly eventScope!: 'tenant' | 'global' | 'cross-tenant';
  public readonly aggregateType!: string;
  public readonly aggregateId!: string;
  public readonly eventType!: string;
  public readonly eventVersion!: string;
  public readonly payload!: Record<string, unknown>;

  public readonly requiresOrdering!: boolean;
  public readonly sequenceNumber?: number;

  public readonly payloadSchemaVersion?: string;
  public readonly maxRetryAttempts!: number;
  public readonly priority!: number;
  public readonly availableAt!: Date;
  public readonly expiresAt?: Date;
  public readonly correlationId?: string;
  public readonly causationId?: string;
  public readonly messageId?: string;
  public readonly metadata?: Record<string, unknown>;
  public readonly createdByUserId?: string;
  public readonly createdByService?: string;
  public readonly createdAt!: Date;

  private _deliveryTargets?: Array<{
    targetService: string;
    targetTenant?: string;
    delivered: boolean;
    deliveredAt?: Date;
    attempts: number;
    lastError?: string;
  }>;

  private _status: 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying';
  private _processingAttempts: number;
  private _lastErrorAt?: Date;
  private _lastErrorMessage?: string;
  private _lastErrorCode?: string;
  private _errorDetails?: Record<string, unknown>;
  private _processorId?: string;
  private _lockedAt?: Date;
  private _processedAt?: Date;
  private _updatedAt: Date;

  private constructor(props: IOutboxEventProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.sourceTenantId = props.sourceTenantId;
    this.targetTenantId = props.targetTenantId;
    this.eventScope = props.eventScope;
    this.aggregateType = props.aggregateType;
    this.aggregateId = props.aggregateId;
    this.eventType = props.eventType;
    this.eventVersion = props.eventVersion;
    this.payload = props.payload;

    this.requiresOrdering = props.requiresOrdering;
    this.sequenceNumber = props.sequenceNumber;

    this.payloadSchemaVersion = props.payloadSchemaVersion;
    this.maxRetryAttempts = props.maxRetryAttempts;
    this.priority = props.priority;
    this.availableAt = props.availableAt;
    this.expiresAt = props.expiresAt;
    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
    this.messageId = props.messageId;
    this.metadata = props.metadata;
    this.createdByUserId = props.createdByUserId;
    this.createdByService = props.createdByService;
    this.createdAt = props.createdAt;

    this._deliveryTargets = props.deliveryTargets;

    this._status = props.status;
    this._processingAttempts = props.processingAttempts;
    this._lastErrorAt = props.lastErrorAt;
    this._lastErrorMessage = props.lastErrorMessage;
    this._lastErrorCode = props.lastErrorCode;
    this._errorDetails = props.errorDetails;
    this._processorId = props.processorId;
    this._lockedAt = props.lockedAt;
    this._processedAt = props.processedAt;
    this._updatedAt = props.updatedAt;
  }

  public static createNew(
    eventScope: 'tenant' | 'global' | 'cross-tenant',
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    eventVersion: string,
    payload: Record<string, unknown>,
    options: {
      sourceTenantId?: string;
      targetTenantId?: string;
      requiresOrdering?: boolean;
      sequenceNumber?: number;
      payloadSchemaVersion?: string;
      maxRetryAttempts?: number;
      priority?: number;
      availableAt?: Date;
      expiresAt?: Date;
      correlationId?: string;
      causationId?: string;
      messageId?: string;
      metadata?: Record<string, unknown>;
      createdByUserId?: string;
      createdByService?: string;
    } = {},
  ): OutboxEventEntity {
    const now = new Date();

    return new OutboxEventEntity({
      sourceTenantId: options.sourceTenantId,
      targetTenantId: options.targetTenantId,
      eventScope,
      aggregateType,
      aggregateId,
      eventType,
      eventVersion,
      payload,
      requiresOrdering: options.requiresOrdering ?? false,
      sequenceNumber: options.sequenceNumber ?? 0,
      payloadSchemaVersion: options.payloadSchemaVersion,
      status: 'pending',
      processingAttempts: 0,
      maxRetryAttempts: options.maxRetryAttempts ?? 3,
      priority: options.priority ?? 0,
      availableAt: options.availableAt ?? now,
      expiresAt: options.expiresAt,
      correlationId: options.correlationId,
      causationId: options.causationId,
      messageId: options.messageId,
      metadata: options.metadata,
      createdByUserId: options.createdByUserId,
      createdByService: options.createdByService,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: IOutboxEventProps): OutboxEventEntity {
    return new OutboxEventEntity(props);
  }

  // ----------------- Getters -----------------

  public get deliveryTargets():
    | Array<{
        targetService: string;
        targetTenant?: string;
        delivered: boolean;
        deliveredAt?: Date;
        attempts: number;
        lastError?: string;
      }>
    | undefined {
    return this._deliveryTargets;
  }

  public get status(): 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying' {
    return this._status;
  }

  public get processingAttempts(): number {
    return this._processingAttempts;
  }

  public get lastErrorAt(): Date | undefined {
    return this._lastErrorAt;
  }

  public get lastErrorMessage(): string | undefined {
    return this._lastErrorMessage;
  }

  public get lastErrorCode(): string | undefined {
    return this._lastErrorCode;
  }

  public get errorDetails(): Record<string, unknown> | undefined {
    return this._errorDetails;
  }

  public get processorId(): string | undefined {
    return this._processorId;
  }

  public get lockedAt(): Date | undefined {
    return this._lockedAt;
  }

  public get processedAt(): Date | undefined {
    return this._processedAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get isExpired(): boolean {
    return this.expiresAt !== undefined && this.expiresAt < new Date();
  }

  public get isProcessed(): boolean {
    return this._status === 'processed';
  }

  public get isFailed(): boolean {
    return this._status === 'failed' || this._status === 'dead_letter';
  }

  public get isMaxAttemptsReached(): boolean {
    return this._processingAttempts >= this.maxRetryAttempts;
  }

  public get isLocked(): boolean {
    return this._lockedAt !== undefined && this._processorId !== undefined;
  }

  public get isAvailable(): boolean {
    return this.availableAt <= new Date() && !this.isLocked && !this.isExpired;
  }

  public get allTargetsDelivered(): boolean {
    if (!this._deliveryTargets || this._deliveryTargets.length === 0) {
      return true;
    }
    return this._deliveryTargets.every((target) => target.delivered);
  }

  // --------------- Business Methods ---------------

  public incrementProcessingAttempts(): void {
    this._processingAttempts += 1;
    this._updatedAt = new Date();
  }

  public resetProcessingAttempts(): void {
    this._processingAttempts = 0;
    this._updatedAt = new Date();
  }

  public markAsProcessing(processorId: string): void {
    this._status = 'processing';
    this._processorId = processorId;
    this._lockedAt = new Date();
    this._updatedAt = new Date();
  }

  public markAsProcessed(): void {
    this._status = 'processed';
    this._processedAt = new Date();
    this._processorId = undefined;
    this._lockedAt = undefined;
    this._updatedAt = new Date();
  }

  public markAsFailed(errorMessage: string, errorCode?: string, errorDetails?: Record<string, unknown>): void {
    this._status = this.isMaxAttemptsReached ? 'dead_letter' : 'failed';
    this._lastErrorAt = new Date();
    this._lastErrorMessage = errorMessage;
    this._lastErrorCode = errorCode;
    this._errorDetails = errorDetails;
    this._processorId = undefined;
    this._lockedAt = undefined;
    this._updatedAt = new Date();
  }

  public markAsRetrying(): void {
    this._status = 'retrying';
    this._processorId = undefined;
    this._lockedAt = undefined;
    this._updatedAt = new Date();
  }

  public releaseLock(): void {
    this._processorId = undefined;
    this._lockedAt = undefined;
    this._status = 'pending';
    this._updatedAt = new Date();
  }

  public addDeliveryTarget(targetService: string, targetTenant?: string): void {
    if (!this._deliveryTargets) {
      this._deliveryTargets = [];
    }

    this._deliveryTargets.push({
      targetService,
      targetTenant,
      delivered: false,
      attempts: 0,
    });

    this._updatedAt = new Date();
  }

  public markDeliveryTargetAsDelivered(targetService: string, targetTenant?: string): void {
    if (!this._deliveryTargets) return;

    const target = this._deliveryTargets.find((t) => t.targetService === targetService && t.targetTenant === targetTenant);

    if (target) {
      target.delivered = true;
      target.deliveredAt = new Date();
      this._updatedAt = new Date();
    }
  }

  public markDeliveryTargetAsFailed(targetService: string, errorMessage: string, targetTenant?: string): void {
    if (!this._deliveryTargets) return;

    const target = this._deliveryTargets.find((t) => t.targetService === targetService && t.targetTenant === targetTenant);

    if (target) {
      target.attempts += 1;
      target.lastError = errorMessage;
      this._updatedAt = new Date();
    }
  }
}
