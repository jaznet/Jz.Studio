import { Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';

type CountySelectionGesture = 'click' | 'primary-pointer';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService {

  private readonly path = geoPath();

  render(
    countyLayer: any,
    countyFeaturesCollection: any,
    pathClass: string,
    gesture: CountySelectionGesture,
    onCountySelected: (countyFeature: any) => void,
    includeTitle = false
  ): void {
    const countyPaths = countyLayer
      .selectAll('path')
      .data(countyFeaturesCollection.features, (county: any) => county.id)
      .join('path')
      .attr('d', this.path as any)
      .attr('fips', (county: any) => county.id)
      .attr('name', (county: any) => county.properties?.name)
      .attr('class', pathClass)
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', null)
      .on('pointerup', null);

    if (gesture === 'primary-pointer') {
      countyPaths.on(
        'pointerup',
        (event: PointerEvent, countyFeature: any) => {
          if (!event.isPrimary || event.button !== 0) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          onCountySelected(countyFeature);
        }
      );
    } else {
      countyPaths.on(
        'click',
        (_event: MouseEvent, countyFeature: any) =>
          onCountySelected(countyFeature)
      );
    }

    if (includeTitle) {
      countyPaths
        .selectAll('title')
        .data((county: any) => [county])
        .join('title')
        .text((county: any) => county.properties?.name ?? '');
    }
  }
}
