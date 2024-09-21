import { default as ComponentUseCases } from './component';
import { default as ThemeUseCases } from './theme';

export { CreateComponentUseCase, DeleteComponentUseCase, ListAllComponentUseCase, UpdateComponentUseCase } from './component';
export { CreateThemeUseCase, DeleteThemeUseCase, ListAllThemeUseCase, UpdateThemeUseCase } from './theme';

export default [...ComponentUseCases, ...ThemeUseCases];
