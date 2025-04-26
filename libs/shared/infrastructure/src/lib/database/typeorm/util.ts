import { Column, ColumnOptions } from 'typeorm';

export interface StringColumnOptions extends ColumnOptions {
  /** Remove whitespace from both ends of the string */
  trim?: boolean;
  /** Convert the string to lowercase */
  lowercase?: boolean;
  /** Convert the string to uppercase */
  uppercase?: boolean;
  /** Capitalize the first letter of the string */
  capitalize?: boolean;
  /**
   * Provide a custom transformation function that takes the
   * already processed string and returns a new string.
   */
  customTransform?: (value: string) => string;
}

export function StringColumn(options?: StringColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    transformer: {
      to: (value: unknown): unknown => {
        if (typeof value !== 'string') return value;
        let result = value;
        if (options?.trim) {
          result = result.trim();
        }
        // Apply uppercase if specified; else if lowercase; else if capitalize.
        if (options?.uppercase) {
          result = result.toUpperCase();
        } else if (options?.lowercase) {
          result = result.toLowerCase();
        } else if (options?.capitalize) {
          result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        // Apply any custom transformation provided
        if (options?.customTransform) {
          result = options.customTransform(result);
        }
        return result;
      },
      from: (value: unknown): unknown => value,
    },
  });
}
