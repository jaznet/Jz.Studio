import { CountyPathSelection } from './factories/county-layer-factory.model';

export interface CountyTitleRenderer {
  render(countyPaths: CountyPathSelection): void;
}
