// Supporting interfaces
export interface AutoGenerateConfig {
  prefix?: string;
  suffix?: string;
  length?: number;
  charset?: string;
  template?: string;
  counter?: {
    start: number;
    step: number;
  };
}
