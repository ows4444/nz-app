export interface IDeadLetterEventProps {
  id?: string;
  sourceTenantId?: string;
  targetTenantId?: string;
  eventScope: 'tenant' | 'global' | 'cross-tenant';
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventVersion: string;
  payload: Record<string, unknown>;
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
  originalEventId: string;
  eventSource: 'inbox' | 'outbox';
  originalPriority: number;
  originalCreatedAt: Date;
  originalAvailableAt: Date;
  failureReason: string;
  failureCode?: string;
  failureDetails?: Record<string, unknown>;
  totalAttempts: number;
  firstFailedAt: Date;
  lastFailedAt: Date;
  lastProcessorId?: string;
  reprocessed: boolean;
  reprocessedAt?: Date;
  reprocessedEventId?: string;
  reprocessedBy?: string;
  failureCategory?: string;
  canRetry: boolean;
  resolutionNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export class DeadLetterEventEntity {
  public readonly id!: string;
  public readonly sourceTenantId?: string;
  public readonly targetTenantId?: string;
  public readonly eventScope: 'tenant' | 'global' | 'cross-tenant';
  public readonly aggregateType: string;
  public readonly aggregateId: string;
  public readonly eventType: string;
  public readonly eventVersion: string;
  public readonly payload: Record<string, unknown>;
  public readonly payloadSchemaVersion?: string;
  public readonly status: 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying';
  public readonly processingAttempts: number;
  public readonly maxRetryAttempts: number;
  public readonly lastErrorAt?: Date;
  public readonly lastErrorMessage?: string;
  public readonly lastErrorCode?: string;
  public readonly errorDetails?: Record<string, unknown>;
  public readonly priority: number;
  public readonly availableAt: Date;
  public expiresAt?: Date;
  public processorId?: string;
  public lockedAt?: Date;
  public processedAt?: Date;
  public correlationId?: string;
  public causationId?: string;
  public messageId?: string;
  public metadata?: Record<string, unknown>;
  public createdByUserId?: string;
  public createdByService?: string;

  // Dead letter specific fields
  public originalEventId!: string;
  public eventSource!: 'inbox' | 'outbox';
  public originalPriority!: number;
  public originalCreatedAt!: Date;
  public originalAvailableAt!: Date;
  public failureReason!: string;
  public failureCode?: string;
  public failureDetails?: Record<string, unknown>;
  public totalAttempts!: number;
  public firstFailedAt!: Date;
  public lastFailedAt!: Date;
  public lastProcessorId?: string;
  public reprocessed!: boolean;
  public reprocessedAt?: Date;
  public reprocessedEventId?: string;
  public reprocessedBy?: string;
  public failureCategory?: string;
  public canRetry!: boolean;

  // Audit fields
  private _createdAt: Date = new Date();
  private _updatedAt: Date = new Date();

  private constructor(props: IDeadLetterEventProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.sourceTenantId = props.sourceTenantId ?? undefined; // Optional
    this.targetTenantId = props.targetTenantId ?? undefined; // Optional
    this.eventScope = props.eventScope;
    this.aggregateType = props.aggregateType;
    this.aggregateId = props.aggregateId;
    this.eventType = props.eventType;
    this.eventVersion = props.eventVersion;
    this.payload = props.payload;
    this.payloadSchemaVersion = props.payloadSchemaVersion;
    this.status = props.status;
    this.processingAttempts = props.processingAttempts;
    this.maxRetryAttempts = props.maxRetryAttempts;
    this.lastErrorAt = props.lastErrorAt;
    this.lastErrorMessage = props.lastErrorMessage;
    this.lastErrorCode = props.lastErrorCode;
    this.errorDetails = props.errorDetails;
    this.priority = props.priority;
    this.availableAt = props.availableAt;
    this.expiresAt = props.expiresAt;
    this.processorId = props.processorId;
    this.lockedAt = props.lockedAt;
    this.processedAt = props.processedAt;
    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
    this.messageId = props.messageId;
    this.metadata = props.metadata;
    this.createdByUserId = props.createdByUserId;
    this.createdByService = props.createdByService;
    this.originalEventId = props.originalEventId;
    this.eventSource = props.eventSource;
    this.originalPriority = props.originalPriority;
    this.originalCreatedAt = props.originalCreatedAt;
    this.originalAvailableAt = props.originalAvailableAt;
    this.failureReason = props.failureReason;
    this.failureCode = props.failureCode;
    this.failureDetails = props.failureDetails;
    this.totalAttempts = props.totalAttempts;
    this.firstFailedAt = props.firstFailedAt;
    this.lastFailedAt = props.lastFailedAt;
    this.lastProcessorId = props.lastProcessorId;
    this.reprocessed = props.reprocessed;
    this.reprocessedAt = props.reprocessedAt;
    this.reprocessedEventId = props.reprocessedEventId;
    this.reprocessedBy = props.reprocessedBy;
    this.failureCategory = props.failureCategory;
    this.canRetry = props.canRetry;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }
  public static createNew(props: Omit<IDeadLetterEventProps, 'id' | 'createdAt' | 'updatedAt'>): DeadLetterEventEntity {
    const now = new Date();
    return new DeadLetterEventEntity({
      ...props,

      createdAt: now,
      updatedAt: now,
    });
  }
  public static restore(props: IDeadLetterEventProps): DeadLetterEventEntity {
    return new DeadLetterEventEntity(props);
  }

  // ----------------- Getters -----------------

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public updateAuditFields(): void {
    this._updatedAt = new Date();
  }

  public updateReprocessingDetails(reprocessedEventId: string, reprocessedBy: string): void {
    this.reprocessed = true;
    this.reprocessedAt = new Date();
    this.reprocessedEventId = reprocessedEventId;
    this.reprocessedBy = reprocessedBy;
    this.updateAuditFields();
  }

  public updateFailureDetails(failureReason: string, failureCode?: string, failureDetails?: Record<string, unknown>, canRetry = true): void {
    this.failureReason = failureReason;
    this.failureCode = failureCode;
    this.failureDetails = failureDetails;
    this.canRetry = canRetry;
    this.lastFailedAt = new Date();
    this.totalAttempts += 1;
    if (this.firstFailedAt === undefined) {
      this.firstFailedAt = new Date();
    }
    this.updateAuditFields();
  }
}
