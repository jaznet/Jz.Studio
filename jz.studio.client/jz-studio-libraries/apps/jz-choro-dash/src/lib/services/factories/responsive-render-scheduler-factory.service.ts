import { Injectable } from '@angular/core';

import { ResponsiveRenderSchedulerFactory } from '../../models/factories/responsive-render-scheduler-factory.model';
import { RenderScheduler } from '../../models/responsive-render-scheduler.model';
import { ResponsiveRenderScheduler } from '../responsive-render-scheduler.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveRenderSchedulerFactoryService
  implements ResponsiveRenderSchedulerFactory {

  create(render: () => void): RenderScheduler {
    return new ResponsiveRenderScheduler(render);
  }
}
