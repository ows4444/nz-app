export class Username {
  private constructor(private readonly value: string) {}

  public static create(username: string): Username {
    if (!this.isValid(username)) {
      throw new Error('Invalid username: must be 3–20 characters, alphanumeric or underscore.');
    }

    return new Username(username.toLowerCase()); // normalize if needed
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Username): boolean {
    return this.value === other.getValue();
  }

  private static isValid(username: string): boolean {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  }
}
