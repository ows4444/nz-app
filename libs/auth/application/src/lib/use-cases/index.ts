import { LoginUserUseCase } from './login-user.use-case';
import { RegisterUserUseCase } from './register-user.use-case';

export const UseCases = [RegisterUserUseCase, LoginUserUseCase];
export * from './login-user.use-case';
export * from './register-user.use-case';
