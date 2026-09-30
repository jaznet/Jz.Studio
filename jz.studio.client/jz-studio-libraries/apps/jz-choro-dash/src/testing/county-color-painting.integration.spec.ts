import { select } from 'd3-selection';

import { CountyFeature } from '../lib/models/county-feature.model';
import { CountyLayerRenderStepContext } from '../lib/models/county-layer-render-step.model';
import {
  CountyLayerSelection,
  CountyPathSelection
} from '../lib/models/factories/county-layer-factory.model';
import { CountyColorRenderStepService } from '../lib/services/county-color-render-step.service';
import { CountyLayerRenderContextGuardService } from '../lib/services/county-layer-render-context-guard.service';
import { MetricCountyColorResolverFactoryService } from '../lib/services/factories/metric-county-color-resolver-factory.service';
import { COUNTY_VALUES_FIXTURE } from './fixtures/county-values.fixture';

describe('County color painting integration', () => {
  it('turns county metric values into representative SVG colors', () => {
    const countyIds = [
      ...COUNTY_VALUES_FIXTURE.map(item => item.countyId),
      '99999'
    ];
    const countyLayerElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    const countyLayer: CountyLayerSelection =
      select<SVGGElement, unknown>(countyLayerElement);
    const countyPaths: CountyPathSelection = countyLayer
      .selectAll<SVGPathElement, CountyFeature>('path')
      .data(countyIds.map(countyFeature))
      .join('path');
    const colorResolver = new MetricCountyColorResolverFactoryService().create({
      values: COUNTY_VALUES_FIXTURE,
      stops: [
        { maximum: 20, color: '#e8dfcf' },
        { maximum: 40, color: '#c9b38f' },
        { maximum: 60, color: '#a68158' },
        { maximum: 80, color: '#76583f' },
        { maximum: 100, color: '#44342b' }
      ],
      missingValueColor: '#302f2d'
    });
    const context: CountyLayerRenderStepContext = {
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
        colorResolver
      }
    };

    new CountyColorRenderStepService(
      new CountyLayerRenderContextGuardService()
    ).execute(context);

    const renderedColors = Array.from(
      countyLayerElement.querySelectorAll('path'),
      path => path.style.getPropertyValue('--_choro-county-data-fill')
    );

    expect(renderedColors).toEqual([
      '#e8dfcf',
      '#c9b38f',
      '#a68158',
      '#76583f',
      '#44342b',
      '#302f2d'
    ]);
  });

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
