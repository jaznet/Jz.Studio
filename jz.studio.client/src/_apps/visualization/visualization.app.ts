
import { JzAppDefinition } from '../../_shell/interfaces/jz-app-definition.interface';
import { VISUALIZATION_ROUTES } from './visualization.routes';

export const VISUALIZATION_APP: JzAppDefinition = {
  id: 'visualization',
  title: 'Visualization',
  routePath: 'visualization',
  routes: VISUALIZATION_ROUTES,
  navLabel: 'Visualization',
  icon: 'bar_chart',
  description: 'Data visualization and analytical chart engines.',
  defaultRoute: 'welcome',
  showInNavigation: true
};
