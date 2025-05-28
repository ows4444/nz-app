import { RegisterDto } from '@nz/identity-device-presentation';

export class RegisterCommand {
  constructor(public readonly payload: RegisterDto) {}
}
