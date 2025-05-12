import { LoginByUsernameDto } from '@nz/iam-presentation';

export class LoginByUsernameCommand {
  constructor(public readonly payload: LoginByUsernameDto) {}
}
