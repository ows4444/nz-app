import { LoginByEmailDto } from '@nz/iam-presentation';

export class LoginByEmailCommand {
  constructor(public readonly payload: LoginByEmailDto) {}
}
