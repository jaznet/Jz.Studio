import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyTitleRenderer } from '../models/county-title-renderer.model';
import { CountyPathSelection } from '../models/factories/county-layer-factory.model';

@Injectable({
  providedIn: 'root'
})
export class CountyTitleRendererService implements CountyTitleRenderer {

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
