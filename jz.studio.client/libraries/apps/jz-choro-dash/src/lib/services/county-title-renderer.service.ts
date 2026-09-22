import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyPathSelection } from '../models/county-layer-factory.model';

@Injectable({
  providedIn: 'root'
})
export class CountyTitleRendererService {

  render(countyPaths: CountyPathSelection): void {
    countyPaths
      .selectAll<SVGTitleElement, CountyFeature>('title')
      .data((county: CountyFeature) => [county])
      .join('title')
      .text(
        (county: CountyFeature) => county.properties?.name ?? ''
      );
  }
}
