export interface IEventProcessingMetricsProps {
  id?: string;
  tenantId?: string;
  eventType: string;
  eventSource: 'inbox' | 'outbox';
  dateHour: Date;
  totalEvents: number;
  processedEvents: number;
  failedEvents: number;
  avgProcessingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class EventProcessingMetricsEntity {
  public readonly id!: string;
  public readonly tenantId?: string;
  public readonly eventType: string;
  public readonly eventSource: 'inbox' | 'outbox';
  public readonly dateHour: Date;
  public readonly totalEvents: number;
  public _processedEvents: number;
  public _failedEvents: number;
  private _avgProcessingTimeMs?: number;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IEventProcessingMetricsProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.tenantId = props.tenantId;
    this.eventType = props.eventType;
    this.eventSource = props.eventSource;
    this.dateHour = props.dateHour;
    this.totalEvents = props.totalEvents;
    this._processedEvents = props.processedEvents;
    this._failedEvents = props.failedEvents;
    this._avgProcessingTimeMs = props.avgProcessingTimeMs;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static createNew(props: Omit<IEventProcessingMetricsProps, 'id' | 'createdAt' | 'updatedAt'>): EventProcessingMetricsEntity {
    const now = new Date();
    return new EventProcessingMetricsEntity({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: IEventProcessingMetricsProps): EventProcessingMetricsEntity {
    return new EventProcessingMetricsEntity(props);
  }

  // ----------------- Getters -----------------

  public get avgProcessingTimeMs(): number | undefined {
    return this._avgProcessingTimeMs;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get processedEvents(): number {
    return this._processedEvents;
  }

  public get failedEvents(): number {
    return this._failedEvents;
  }

  // --------------- Business Methods ---------------

  public updateMetrics(processedEvents: number, failedEvents: number, avgProcessingTimeMs?: number): void {
    this._updatedAt = new Date();
    this._processedEvents += processedEvents;
    this._failedEvents += failedEvents;
    if (avgProcessingTimeMs !== undefined) {
      this._avgProcessingTimeMs = avgProcessingTimeMs;
    }
  }

  public resetMetrics(): void {
    this._processedEvents = 0;
    this._failedEvents = 0;
    this._avgProcessingTimeMs = undefined;
    this._updatedAt = new Date();
  }
}
