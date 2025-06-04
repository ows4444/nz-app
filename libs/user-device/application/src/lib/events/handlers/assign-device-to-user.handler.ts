import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { AssignDeviceToUserEvent, DeviceEntity, UserDeviceEntity } from '@nz/identity-device-domain';
import { TypeormDeviceRepository, TypeormUserDeviceRepository } from '@nz/identity-device-infrastructure';
import { GrpcUnknownException } from '@nz/shared-infrastructure';
import { DataSource } from 'typeorm';

@EventsHandler(AssignDeviceToUserEvent)
export class AssignDeviceToUserEventHandler implements IEventHandler<AssignDeviceToUserEvent> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly deviceRepository: TypeormDeviceRepository,
    private readonly userDeviceRepository: TypeormUserDeviceRepository,
  ) {}

  async handle({ userId, deviceInfo, deviceId }: AssignDeviceToUserEvent) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existDevice = await this.deviceRepository.findOneByDeviceId(deviceId, queryRunner);

      if (existDevice) {
        await this.userDeviceRepository.save(UserDeviceEntity.createNew(userId, existDevice.id), queryRunner);
      } else {
        const newDevice = await this.deviceRepository.save(DeviceEntity.createNew(deviceId, deviceInfo), queryRunner);

        await this.userDeviceRepository.save(UserDeviceEntity.createNew(userId, newDevice.id), queryRunner);
      }

      await queryRunner.commitTransaction();
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();

      if (error instanceof RpcException) {
        throw error;
      }
      throw new GrpcUnknownException(error as Error);
    } finally {
      await queryRunner.release();
    }
  }
}
