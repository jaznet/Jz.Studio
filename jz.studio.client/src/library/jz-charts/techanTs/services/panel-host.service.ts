// panel-host.service.ts
import {
  Injectable, ApplicationRef, ComponentRef, Type, EnvironmentInjector, createComponent
} from '@angular/core';
import { select } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class PanelHostService {
  constructor(private appRef: ApplicationRef, private env: EnvironmentInjector) { }

  /** Ensure <g id="{groupId}"> exists under parentG, and mount the component into it. */
  injectChartComponent<T>(
    parentG: SVGGElement,
    groupId: string,
    component: Type<T>
  ): ComponentRef<T> {
    if (!parentG) throw new Error('injectChartComponent: parentG is null/undefined');

    const id = String(groupId);
    const esc = (window as any).CSS?.escape ? (window as any).CSS.escape(id) : id;

    const hostG = select(parentG)
      .selectAll<SVGGElement, unknown>(`g#${esc}`)
      .data([null])
      .join('g')
      .attr('id', id)
      .node() as SVGGElement;

    const ref = createComponent(component, {
      environmentInjector: this.env,
      hostElement: hostG
    });
    this.appRef.attachView(ref.hostView);

    return ref;
  }

  destroy(ref: ComponentRef<any>): void {
    this.appRef.detachView(ref.hostView);
    const host = ref.location?.nativeElement as Element | null;
    ref.destroy();
    host?.parentNode?.removeChild(host);
  }
}
