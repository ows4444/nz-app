export class CreateUserCredentialEvent {
  constructor(public readonly userId: string, public readonly password: string, public readonly lang: string) {}
}
