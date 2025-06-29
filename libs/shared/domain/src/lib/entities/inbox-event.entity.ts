export interface IInboxEventProps {
  id?: string;
  sourceTenantId?: string;
  targetTenantId?: string;
  eventScope: 'tenant' | 'global' | 'cross-tenant';
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventVersion: string;
  payload: Record<string, unknown>;

  receivedAt: Date;
  originalEventId?: string;

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

export class InboxEventEntity {
  public readonly id!: string;
  public readonly sourceTenantId?: string;
  public readonly targetTenantId?: string;
  public readonly eventScope!: 'tenant' | 'global' | 'cross-tenant';
  public readonly aggregateType!: string;
  public readonly aggregateId!: string;
  public readonly eventType!: string;
  public readonly eventVersion!: string;
  public readonly payload!: Record<string, unknown>;

  public readonly receivedAt!: Date;
  public readonly originalEventId?: string;

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

  private constructor(props: IInboxEventProps) {
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

    this.receivedAt = props.receivedAt;
    this.originalEventId = props.originalEventId;

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
      originalEventId?: string;
    } = {},
  ): InboxEventEntity {
    const now = new Date();
    return new InboxEventEntity({
      sourceTenantId: options.sourceTenantId,
      targetTenantId: options.targetTenantId,
      eventScope,
      aggregateType,
      aggregateId,
      eventType,
      eventVersion,
      payload,
      receivedAt: now,
      originalEventId: options.originalEventId,
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

  public static restore(props: IInboxEventProps): InboxEventEntity {
    return new InboxEventEntity(props);
  }

  // ----------------- Getters -----------------

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
}
