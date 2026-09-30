import { select } from 'd3-selection';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerSelection } from '../models/factories/county-layer-factory.model';
import { CountySelectionHighlighterService } from './county-selection-highlighter.service';

describe('CountySelectionHighlighterService', () => {
  const pathSelector = '.county';
  let countyLayerElement: SVGGElement;
  let countyLayer: CountyLayerSelection;
  let service: CountySelectionHighlighterService;

  beforeEach(() => {
    countyLayerElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    countyLayer = select<SVGGElement, unknown>(countyLayerElement);
    service = new CountySelectionHighlighterService();

    addCountyPath('06037');
    addCountyPath('6071');
    addCountyPath('06059');
  });

  it('selects a county using its normalized five-digit identifier', () => {
    service.apply(countyLayer, pathSelector, '06071');

    const selectedPath = countyLayerElement.querySelector(
      '[data-county-id="6071"]'
    );

    expect(selectedPath?.classList.contains('is-selected')).toBeTrue();
  });

  it('raises the selected county above the other county paths', () => {
    service.apply(countyLayer, pathSelector, '06037');

    expect(countyLayerElement.lastElementChild?.getAttribute('data-county-id'))
      .toBe('06037');
  });

  it('clears the selection when no county is selected', () => {
    service.apply(countyLayer, pathSelector, '06059');
    service.apply(countyLayer, pathSelector, null);

    expect(countyLayerElement.querySelector('.is-selected')).toBeNull();
  });

  function addCountyPath(countyId: string): void {
    const county: CountyFeature = {
      type: 'Feature',
      id: countyId,
      properties: null,
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };

    countyLayer
      .append<SVGPathElement>('path')
      .attr('class', 'county')
      .attr('data-county-id', countyId)
      .datum(county);
  }
});
