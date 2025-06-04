export class Email {
  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    if (!this.isValid(email)) throw new Error('Invalid email');
    return new Email(email.toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
