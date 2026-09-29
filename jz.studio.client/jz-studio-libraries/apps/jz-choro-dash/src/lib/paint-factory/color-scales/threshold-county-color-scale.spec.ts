import { COUNTY_VALUES_FIXTURE } from '../../../testing/fixtures/county-values.fixture';
import { ThresholdCountyColorScale } from './threshold-county-color-scale';

describe('ThresholdCountyColorScale', () => {
  const scale = new ThresholdCountyColorScale([
    { maximum: 0, color: 'lowest' },
    { maximum: 25, color: 'low' },
    { maximum: 50, color: 'middle' },
    { maximum: 75, color: 'high' },
    { maximum: 100, color: 'highest' }
  ]);

  it('maps fixture values to their inclusive threshold colors', () => {
    const colors = COUNTY_VALUES_FIXTURE.map(item => scale.getColor(item.value));

    expect(colors).toEqual([
      'lowest',
      'low',
      'middle',
      'high',
      'highest'
    ]);
  });

  it('uses the highest color for values above the final threshold', () => {
    expect(scale.getColor(125)).toBe('highest');
  });
});
