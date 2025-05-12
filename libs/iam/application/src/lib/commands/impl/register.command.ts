import { RegisterDto } from '@nz/iam-presentation';

export class RegisterCommand {
  constructor(public readonly payload: RegisterDto) {}
}
