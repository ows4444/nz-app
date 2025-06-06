import { RegisterDto } from '@nz/auth-session-presentation';

export class RegisterCommand {
  constructor(public readonly payload: RegisterDto, public readonly lang: string) {}
}
