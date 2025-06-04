import { RegisterDto } from '@nz/user-device-presentation';

export class RegisterCommand {
  constructor(public readonly payload: RegisterDto, public readonly lang: string) {}
}
