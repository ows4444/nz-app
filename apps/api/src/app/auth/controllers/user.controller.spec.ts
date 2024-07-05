import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('UserService Int', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
  });
});
