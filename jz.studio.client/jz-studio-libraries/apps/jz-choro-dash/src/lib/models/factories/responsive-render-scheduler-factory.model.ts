import { RenderScheduler } from '../responsive-render-scheduler.model';

export interface ResponsiveRenderSchedulerFactory {
  create(render: () => void): RenderScheduler;
}
