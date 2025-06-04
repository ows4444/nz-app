import { DeviceTrustScoreEntity } from '@nz/identity-device-domain';
import { DeviceTrustScoreEntityORM } from '../entities';

export class DeviceTrustScoreMapper {
  static toDomain(deviceTrustScore: DeviceTrustScoreEntityORM): DeviceTrustScoreEntity {
    return DeviceTrustScoreEntity.restore({
      id: deviceTrustScore.id,
      deviceId: deviceTrustScore.deviceId,
      userId: deviceTrustScore.userId,
      tenantId: deviceTrustScore.tenantId,
      trustScore: deviceTrustScore.trustScore,
      riskLevel: deviceTrustScore.riskLevel,
      calculationMethod: deviceTrustScore.calculationMethod,
      contributingFactorsJson: deviceTrustScore.contributingFactorsJson,
      lastCalculatedAt: deviceTrustScore.lastCalculatedAt,
      expiresAt: deviceTrustScore.expiresAt,
      createdAt: deviceTrustScore.createdAt,
      updatedAt: deviceTrustScore.updatedAt,
    });
  }

  static toPersistence(deviceTrustScore: DeviceTrustScoreEntity): Partial<DeviceTrustScoreEntityORM> {
    return {
      id: deviceTrustScore.id,
      deviceId: deviceTrustScore.deviceId,
      userId: deviceTrustScore.userId,
      tenantId: deviceTrustScore.tenantId,
      trustScore: deviceTrustScore.trustScore,
      riskLevel: deviceTrustScore.riskLevel,
      calculationMethod: deviceTrustScore.calculationMethod,
      contributingFactorsJson: deviceTrustScore.contributingFactorsJson,
      lastCalculatedAt: deviceTrustScore.lastCalculatedAt,
      expiresAt: deviceTrustScore.expiresAt,
      createdAt: deviceTrustScore.createdAt,
      updatedAt: deviceTrustScore.updatedAt,
    };
  }
}
