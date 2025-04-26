// Bitwise flag operations utilities
export const hasFlag = (status: number, flag: number): boolean => (status & flag) !== 0;
export const hasNotFlag = (status: number, flag: number): boolean => (status & flag) === 0;
export const addFlag = (status: number, flag: number): number => status | flag;
export const removeFlag = (status: number, flag: number): number => status & ~flag;

// Optional: Common flag combinations
export const combineFlags = (...flags: number[]): number => flags.reduce((acc, flag) => acc | flag, 0);
export const combineFlagsWith = (status: number, ...flags: number[]): number => flags.reduce((acc, flag) => acc | flag, status);
export const removeFlags = (status: number, ...flags: number[]): number => flags.reduce((acc, flag) => acc & ~flag, status);
export const toggleFlag = (status: number, flag: number): number => status ^ flag;
