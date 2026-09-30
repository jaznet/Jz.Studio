import { select } from 'd3-selection';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerRenderStepContext } from '../models/county-layer-render-step.model';
import {
  CountyLayerSelection,
  CountyPathSelection
} from '../models/factories/county-layer-factory.model';
import { CountyColorRenderStepService } from './county-color-render-step.service';
import { CountyLayerRenderContextGuardService } from './county-layer-render-context-guard.service';

describe('CountyColorRenderStepService', () => {
  let countyLayerElement: SVGGElement;
  let countyLayer: CountyLayerSelection;
  let countyPaths: CountyPathSelection;
  let service: CountyColorRenderStepService;

  beforeEach(() => {
    countyLayerElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    countyLayer = select<SVGGElement, unknown>(countyLayerElement);
    countyPaths = countyLayer
      .selectAll<SVGPathElement, CountyFeature>('path')
      .data([countyFeature('06037'), countyFeature('06071')])
      .join('path');
    service = new CountyColorRenderStepService(
      new CountyLayerRenderContextGuardService()
    );
  });

  it('writes each resolved county color to its path data-fill property', () => {
    const context = renderContext((countyId: string) =>
      countyId === '06037' ? '#111111' : '#222222'
    );

    expect(service.execute(context)).toBe(context);

    const renderedPaths = countyLayerElement.querySelectorAll('path');

    expect(renderedPaths[0].style.getPropertyValue(
      '--_choro-county-data-fill'
    )).toBe('#111111');
    expect(renderedPaths[1].style.getPropertyValue(
      '--_choro-county-data-fill'
    )).toBe('#222222');
  });

  it('removes stale data-fill properties when no resolver is configured', () => {
    countyPaths.style('--_choro-county-data-fill', '#abcdef');
    const context = renderContext();

    service.execute(context);

    countyLayerElement.querySelectorAll('path').forEach(path => {
      expect(path.style.getPropertyValue(
        '--_choro-county-data-fill'
      )).toBe('');
    });
  });

  function renderContext(
    getColor?: (countyId: string) => string
  ): CountyLayerRenderStepContext {
    return {
      countyPaths,
      options: {
        countyLayer,
        countyFeaturesCollection: {
          type: 'FeatureCollection',
          features: []
        },
        pathClass: 'county',
        gesture: 'click',
        onCountySelected: () => undefined,
        colorResolver: getColor ? { getColor } : undefined
      }
    };
  }

  function countyFeature(countyId: string): CountyFeature {
    return {
      type: 'Feature',
      id: countyId,
      properties: null,
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
  }
});
