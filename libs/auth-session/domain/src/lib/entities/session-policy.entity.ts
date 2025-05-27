export interface ISessionPolicyProps {
  policyId?: string;
  maxSessions: number;
  inactivityTimeout: number;
  createdAt: Date;
}
export class SessionPolicyEntity {
  public readonly policyId!: string;
  public readonly maxSessions: number;
  public readonly inactivityTimeout: number;
  public readonly createdAt: Date;

  private constructor(props: ISessionPolicyProps) {
    if (props.policyId !== undefined) {
      this.policyId = props.policyId;
    }

    this.maxSessions = props.maxSessions;
    this.inactivityTimeout = props.inactivityTimeout;
    this.createdAt = props.createdAt;
  }
  public static createNew(maxSessions: number, inactivityTimeout: number): SessionPolicyEntity {
    return new SessionPolicyEntity({
      maxSessions,
      inactivityTimeout,
      createdAt: new Date(),
    });
  }
  public static restore(props: ISessionPolicyProps): SessionPolicyEntity {
    return new SessionPolicyEntity(props);
  }
}
