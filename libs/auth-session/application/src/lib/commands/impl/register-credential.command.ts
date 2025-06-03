import { RegisterCredentialDto } from '@nz/auth-session-presentation';

export class RegisterCredentialCommand {
  constructor(public readonly payload: RegisterCredentialDto) {}
}
