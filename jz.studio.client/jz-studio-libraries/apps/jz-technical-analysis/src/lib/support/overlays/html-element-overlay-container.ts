import { OverlayContainer } from "@angular/cdk/overlay";

export class HtmlElementOverlayContainer extends OverlayContainer {
  constructor(private hostElement: HTMLElement = document.body) {
    super();
  }

  protected override _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');
    this.hostElement.appendChild(container);
    this._containerElement = container;
  }
}
