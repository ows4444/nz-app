export class SchemaVersion {
  constructor(
    private readonly major: number,
    private readonly minor: number,
    private readonly patch: number,
  ) {
    if (major < 0 || minor < 0 || patch < 0) {
      throw new Error('Version numbers must be non-negative');
    }
  }

  static fromString(version: string): SchemaVersion {
    const [major, minor, patch] = version.split('.').map(Number);
    return new SchemaVersion(major || 0, minor || 0, patch || 0);
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  isCompatibleWith(other: SchemaVersion): boolean {
    return this.major === other.major;
  }

  isNewer(other: SchemaVersion): boolean {
    if (this.major !== other.major) return this.major > other.major;
    if (this.minor !== other.minor) return this.minor > other.minor;
    return this.patch > other.patch;
  }

  increment(type: 'major' | 'minor' | 'patch'): SchemaVersion {
    switch (type) {
      case 'major':
        return new SchemaVersion(this.major + 1, 0, 0);
      case 'minor':
        return new SchemaVersion(this.major, this.minor + 1, 0);
      case 'patch':
        return new SchemaVersion(this.major, this.minor, this.patch + 1);
    }
  }
}
