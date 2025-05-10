import bcrypt from 'bcrypt';

export class Password {
  private constructor(private readonly value: string) {}

  public static create(password: string, isHashed = false): Password {
    if (!isHashed && !this.isValid(password)) {
      throw new Error('Password must be at least 8 characters');
    }

    const hashedValue = isHashed ? password : this.hash(password);
    return new Password(hashedValue);
  }

  static restore(hashed: string): Password {
    return Password.create(hashed, true);
  }

  public static fromHashed(hashed: string): Password {
    return new Password(hashed);
  }

  public getValue(): string {
    return this.value;
  }

  public compare(plain: string): boolean {
    return bcrypt.compareSync(plain, this.value);
  }

  public equals(other: Password): boolean {
    return this.value === other.getValue();
  }

  private static isValid(password: string): boolean {
    return password.length >= 8;
  }

  private static hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
