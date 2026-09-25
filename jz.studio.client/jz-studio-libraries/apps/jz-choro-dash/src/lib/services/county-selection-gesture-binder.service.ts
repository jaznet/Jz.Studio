import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyPathSelection } from '../models/county-layer-factory.model';
import { CountySelectionGesture } from '../models/county-layer-render-options.model';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionGestureBinderService {

  bind(
    countyPaths: CountyPathSelection,
    gesture: CountySelectionGesture,
    onCountySelected: (countyFeature: CountyFeature) => void
  ): void {
    countyPaths
      .on('click', null)
      .on('pointerup', null);

    if (gesture === 'primary-pointer') {
      countyPaths.on(
        'pointerup',
        (event: PointerEvent, countyFeature: CountyFeature) => {
          if (!event.isPrimary || event.button !== 0) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          onCountySelected(countyFeature);
        }
      );

      return;
    }

    countyPaths.on(
      'click',
      (_event: MouseEvent, countyFeature: CountyFeature) =>
        onCountySelected(countyFeature)
    );
  }
}
