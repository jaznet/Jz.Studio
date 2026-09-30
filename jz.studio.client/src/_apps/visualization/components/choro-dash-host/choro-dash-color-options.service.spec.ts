import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { CountyMetricValue } from 'jz-choro-dash';

import { ChoroDashColorOptionsService } from './choro-dash-color-options.service';
import {
  ChoroDashCountyValuesProvider
} from './choro-dash-county-values-provider.model';
import {
  CHORO_DASH_COUNTY_VALUES_PROVIDER
} from './choro-dash-county-values-provider.token';
import {
  CHORO_DASH_COUNTY_COLOR_STOPS,
  CHORO_DASH_MISSING_VALUE_COLOR
} from './choro-dash-color-scale.config';

describe('ChoroDashColorOptionsService', () => {
  const countyValues: readonly CountyMetricValue[] = [
    { countyId: '06071', value: 72 }
  ];

  class CountyValuesProviderStub
    implements ChoroDashCountyValuesProvider {

    loadCount = 0;

    load() {
      this.loadCount++;
      return of(countyValues);
    }
  }

  let countyValuesProvider: CountyValuesProviderStub;
  let service: ChoroDashColorOptionsService;

  beforeEach(() => {
    countyValuesProvider = new CountyValuesProviderStub();

    TestBed.configureTestingModule({
      providers: [
        ChoroDashColorOptionsService,
        {
          provide: CHORO_DASH_COUNTY_VALUES_PROVIDER,
          useValue: countyValuesProvider
        }
      ]
    });

    service = TestBed.inject(ChoroDashColorOptionsService);
  });

  it('combines county values with the local color policy', async () => {
    const options = await firstValueFrom(service.load());

    expect(countyValuesProvider.loadCount).toBe(1);
    expect(options.values).toBe(countyValues);
    expect(options.stops).toBe(CHORO_DASH_COUNTY_COLOR_STOPS);
    expect(options.missingValueColor)
      .toBe(CHORO_DASH_MISSING_VALUE_COLOR);
  });
});
