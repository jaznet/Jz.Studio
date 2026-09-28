import { Observable } from 'rxjs';

import { MyTopoJSON } from './my-topo-json.model';

export interface TopologySource {
  getTopology(): Observable<MyTopoJSON>;
}
