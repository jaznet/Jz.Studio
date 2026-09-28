import { inject, InjectionToken } from '@angular/core';

import { TopologySource } from '../models/topology-source.model';
import { TopoService } from './topo.service';

export const TOPOLOGY_SOURCE = new InjectionToken<TopologySource>(
  'TopologySource',
  {
    providedIn: 'root',
    factory: () => inject(TopoService)
  }
);
