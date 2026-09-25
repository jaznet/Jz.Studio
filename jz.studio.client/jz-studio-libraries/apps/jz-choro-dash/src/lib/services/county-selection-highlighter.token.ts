import { inject, InjectionToken } from '@angular/core';

import { CountySelectionHighlighter } from '../models/county-selection-highlighter.model';
import { CountySelectionHighlighterService } from './county-selection-highlighter.service';

export const COUNTY_SELECTION_HIGHLIGHTER =
  new InjectionToken<CountySelectionHighlighter>(
    'CountySelectionHighlighter',
    {
      providedIn: 'root',
      factory: () => inject(CountySelectionHighlighterService)
    }
  );
