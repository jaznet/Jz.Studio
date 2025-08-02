import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  ComponentRef,
  Type,
  EmbeddedViewRef
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PanelHostService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  /**
   * Injects a component into a dynamically created <g> SVG group
   * @param svgRoot The <svg> element to append the <g> to
   * @param panelId The ID to assign to the <g> element
   * @param component The component class to inject
   * @param setupFn Optional: function to assign @Input values
   */
  injectChartComponent<T>(
    panelsContainer: SVGGElement,
    panelId: string,
    component: Type<T>,
    setupFn?: (instance: T) => void
  ): ComponentRef<T> {
    // 1. Create the <g> element
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', panelId);
    panelsContainer.appendChild(g);

    // 2. Create the component
    const compRef = this.appRef.bootstrap(component, g);

    // 3. Assign any input values
    if (setupFn) {
      setupFn(compRef.instance);
    }

    return compRef;
  }

  /**
   * Removes a chart panel
   */
  removePanel(panelId: string, svgRoot: SVGSVGElement): void {
    const g = svgRoot.querySelector(`#${panelId}`);
    if (g) svgRoot.removeChild(g);
  }
}
