export const parseBoolean = (value: boolean | 'true' | 'false'): boolean => (typeof value === 'boolean' ? value : typeof value === 'string' && value.toLowerCase() === 'true');
