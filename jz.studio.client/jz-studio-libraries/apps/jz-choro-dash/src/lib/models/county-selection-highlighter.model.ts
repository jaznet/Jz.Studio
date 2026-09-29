import { CountyLayerSelection } from './factories/county-layer-factory.model';

export interface CountySelectionHighlighter {
  apply(
    countyLayer: CountyLayerSelection,
    pathSelector: string,
    selectedCountyId: string | null
  ): void;
}
