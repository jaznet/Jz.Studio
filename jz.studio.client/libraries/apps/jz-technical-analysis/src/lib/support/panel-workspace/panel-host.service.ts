// panel-host.service.ts
import {
  Injectable, ApplicationRef, ComponentRef, Type,
  EnvironmentInjector, createComponent
} from '@angular/core';
import { select } from 'd3-selection';

type InjectOpts = {
  /** Insert host <g> immediately AFTER the first match under parentG (e.g. 'rect.chart-panel') */
  ensureAfter?: string;
  /** Extra classes to add to the host <g> */
  classList?: string[];
  /** Extra attributes to set on the host <g> */
  attrs?: Record<string, string>;
  /** If true, do NOT namespace the id with the parent’s id */
  keepIdGlobal?: boolean;
};

@Injectable({ providedIn: 'root' })
export class PanelHostService {
  constructor(private appRef: ApplicationRef, private env: EnvironmentInjector) { }

  /** Ensure <g> host exists under parentG, mount the component into it, and (optionally) place it after an anchor. */
  injectChartComponent<T>(
    parentG: SVGGElement,            // <g id="gPanel1">
    groupId: string,                 // e.g. "OHLC"
    component: Type<T>,
    opts: InjectOpts = {}
  ): ComponentRef<T> {
    if (!parentG) throw new Error('injectChartComponent: parentG is null/undefined');

    // Safer identity: namespace by panel id to avoid duplicate ids across panels
    const baseId = String(groupId);
    const hostId = opts.keepIdGlobal ? baseId : `${parentG.id || 'panel'}-${baseId}`;

    // CSS.escape fallback
    const esc = (s: string) => (window as any).CSS?.escape ? (window as any).CSS.escape(s) : s;

    // Prefer a data attribute for scoped selection, keep id for convenience/tools
    const dataSel = `g[data-chart-id="${esc(baseId)}"]`;

    // Create or reuse the host <g>
    const hostG = select(parentG)
      .selectAll<SVGGElement, unknown>(dataSel)
      .data([null])
      .join('g')
      .attr('id', hostId)
      .attr('data-chart-id', baseId)
      .each(function () {
        if (opts.classList?.length) this.setAttribute('class', [...new Set((this.getAttribute('class') || '').split(/\s+/).concat(opts.classList))].filter(Boolean).join(' '));
        if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) this.setAttribute(k, v);
      })
      .node() as SVGGElement;

    // Optional deterministic stacking: place host AFTER the given anchor inside parentG
    if (opts.ensureAfter) {
      const anchor = parentG.querySelector(opts.ensureAfter);
      if (anchor) {
        const after = anchor.nextSibling;
        if (after) parentG.insertBefore(hostG, after);
        else parentG.appendChild(hostG);
      } else {
        // Fallback: append at end (top in paint order)
        parentG.appendChild(hostG);
      }
    }

    // Mount Angular component into the host
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
