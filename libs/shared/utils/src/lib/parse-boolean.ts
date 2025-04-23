//export const parseBoolean = (value: boolean | 'true' | 'false'): boolean => (typeof value === 'boolean' ? value : typeof value === 'string' && value.toLowerCase() === 'true');

export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;

  const normalized = String(value).trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
}
