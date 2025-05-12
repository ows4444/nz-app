import { LoginByEmailHandler } from './login-by-email.handler';
import { LoginByUsernameHandler } from './login-by-username.handler';
import { RegisterHandler } from './register.handler';

export const IAMCommandHandlers = [LoginByEmailHandler, LoginByUsernameHandler, RegisterHandler];
