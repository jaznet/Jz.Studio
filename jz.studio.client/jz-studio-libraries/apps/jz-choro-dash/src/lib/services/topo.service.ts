import { Injectable } from '@angular/core';
import { json } from 'd3-fetch';
import { Observable, from } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';

import { MyTopoJSON } from '../models/my-topo-json.model';
import { TopologySource } from '../models/topology-source.model';

@Injectable({
  providedIn: 'root'
})
export class TopoService implements TopologySource {
  private readonly topologyUrl = '/assets/maps/counties-albers-10m.json';

  private topology$?: Observable<MyTopoJSON>;

  getTopology(): Observable<MyTopoJSON> {
    if (!this.topology$) {
      this.topology$ = from(json<MyTopoJSON>(this.topologyUrl)).pipe(
        filter((topology): topology is MyTopoJSON => topology !== undefined),
        shareReplay(1)
      );
    }

    return this.topology$;
  }
}
