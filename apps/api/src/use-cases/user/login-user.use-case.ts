import { User, UserStatus } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(email: string, password: string): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connection.isInitialized || (await queryRunner.connect());
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const user = await repo.user.findOneBy({ email: email });

      if (!user) {
        throw new NotFoundException('User not found');
      } else if (user.status !== UserStatus.ACTIVE) {
        throw new NotFoundException('User is not active');
      } else if (user.password !== password) {
        throw new NotFoundException('Password incorrect');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Login failed due to an error');
    } finally {
      await queryRunner.release();
    }
  }
}
