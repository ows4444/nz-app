import { LoginByEmailHandler } from './login-by-email.handler';
import { LoginByUsernameHandler } from './login-by-username.handler';

export const IAMCommandHandlers = [LoginByEmailHandler, LoginByUsernameHandler];
