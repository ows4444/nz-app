import { AppModule } from '@apps/api/src/app/app.module';
import { CreateRootUserUseCase } from '@apps/api/src/app/auth/use-cases/user/create-root-user.use-case';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateRootUserUseCase Int', () => {
  let moduleRef: TestingModule;

  let createRootUserUseCase: CreateRootUserUseCase;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    createRootUserUseCase = moduleRef.get(CreateRootUserUseCase);
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

  afterAll(async () => {
    await moduleRef.close();
  });
});
