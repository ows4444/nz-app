export interface SanitizationConfig {
  html?: boolean | HtmlSanitizationConfig;
  script?: boolean;
  sql?: boolean;
  xss?: boolean;
  path?: boolean;
  command?: boolean;
  unicode?: boolean;
  bom?: boolean;
  controlChars?: boolean;
  zeroWidth?: boolean;
  rtl?: boolean;
  custom?: CustomSanitizer[];
}

export interface HtmlSanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  stripComments?: boolean;
  stripCdata?: boolean;
  transformTags?: Record<string, string>;
}

export interface CustomSanitizer {
  name: string;
  pattern: string | RegExp;
  replacement: string;
  global?: boolean;
}
