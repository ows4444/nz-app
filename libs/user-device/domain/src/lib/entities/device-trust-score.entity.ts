export interface IDeviceTrustScoreProps {
  id?: string;
  deviceId: string;
  userId: string;
  tenantId?: string;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  calculationMethod: string;
  contributingFactorsJson: string;
  lastCalculatedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class DeviceTrustScoreEntity {
  public readonly id!: string;

  public readonly deviceId: string;
  public readonly userId: string;
  public readonly tenantId?: string;

  public readonly trustScore: number;
  public readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  public readonly calculationMethod: string;
  public readonly contributingFactorsJson: string;
  public readonly lastCalculatedAt: Date;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: IDeviceTrustScoreProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.deviceId = props.deviceId;
    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.trustScore = props.trustScore;
    this.riskLevel = props.riskLevel;
    this.calculationMethod = props.calculationMethod;
    this.contributingFactorsJson = props.contributingFactorsJson;
    this.lastCalculatedAt = props.lastCalculatedAt;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt || new Date();
  }

  public static createNew(deviceId: string, userId: string, calculationMethod: string, contributingFactorsJson?: string, tenantId?: string): DeviceTrustScoreEntity {
    return new DeviceTrustScoreEntity({
      deviceId,
      userId,
      tenantId,
      calculationMethod,
      trustScore: 100,
      riskLevel: 'low',
      contributingFactorsJson: contributingFactorsJson || '{}',
      lastCalculatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IDeviceTrustScoreProps): DeviceTrustScoreEntity {
    return new DeviceTrustScoreEntity(props);
  }
}
