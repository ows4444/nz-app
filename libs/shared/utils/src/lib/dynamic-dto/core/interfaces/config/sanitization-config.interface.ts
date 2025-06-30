export interface SanitizationConfig {
  html?: boolean | HtmlSanitizationConfig;
  script?: boolean;
  sql?: boolean;
  xss?: boolean;
  path?: boolean; // Path traversal
  command?: boolean; // Command injection
  unicode?: boolean; // Unicode normalization attacks
  bom?: boolean; // Byte order mark
  controlChars?: boolean;
  zeroWidth?: boolean; // Zero-width characters
  rtl?: boolean; // RTL override attacks
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
