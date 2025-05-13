export type PepperVersions = Record<string, string>;

export interface AuthEnvironment {
  peppers: PepperVersions;
  defaultPepperVersion: string;
}
