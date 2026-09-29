import { CountyFeature } from '../county-feature.model';
import { CountySelection } from '../county-selection.model';

export interface CountySelectionFactory {
  create(
    countyFeature: CountyFeature,
    stateId?: string | null
  ): CountySelection;
}
