export class AssignDeviceToUserEvent {
  constructor(public readonly userId: string, public readonly deviceId: string, public readonly deviceInfo: string) {}
}
