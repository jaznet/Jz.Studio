import { CountyColorResolverFactoryOptions } from 'jz-choro-dash';

export interface ChoroDashLoadState {
  readonly options?: CountyColorResolverFactoryOptions;
  readonly error?: string;
  readonly empty?: string;
}
