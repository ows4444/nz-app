import { AppModule } from '@apps/api/src/app/app.module';
import { CreateRootUserUseCase } from '@apps/api/src/use-cases/user/create-root-user.use-case';
import { CreateUserUseCase } from '@apps/api/src/use-cases/user/create-user.use-case';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateRootUserUseCase Int', () => {
  let moduleRef: TestingModule;
  let createRootUserUseCase: CreateRootUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    createRootUserUseCase = moduleRef.get(CreateRootUserUseCase);
    createUserUseCase = moduleRef.get(CreateUserUseCase);
  });

  describe('createRootUserUseCase.execute()', () => {
    it('should create a root user', async () => {
      const result = await createRootUserUseCase.execute();
      expect(result).toBe(true);
    });

    it('should not create a root user if it already exists', async () => {
      const result = await createRootUserUseCase.execute();
      expect(result).toBe(false);
    });
  });

  describe('createUserUseCase.execute()', () => {
    it('should create a user', async () => {
      const result = await createUserUseCase.execute('email.com@abcd.com', 'password', 'name', 'username', { id: 1 } as any);
      expect(result).toBe(true);
    });
    it('should not create a user if it already exists', async () => {
      const result = await createUserUseCase.execute('email.com@abcd.com', 'password', 'name', 'username', { id: 1 } as any);
      expect(result).toBe(false);
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});
