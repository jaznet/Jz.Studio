import { inject, InjectionToken } from '@angular/core';

import { ResponsiveRenderSchedulerFactory } from '../../models/factories/responsive-render-scheduler-factory.model';
import { ResponsiveRenderSchedulerFactoryService } from './responsive-render-scheduler-factory.service';

export const RESPONSIVE_RENDER_SCHEDULER_FACTORY =
  new InjectionToken<ResponsiveRenderSchedulerFactory>(
    'ResponsiveRenderSchedulerFactory',
    {
      providedIn: 'root',
      factory: () => inject(ResponsiveRenderSchedulerFactoryService)
    }
  );
