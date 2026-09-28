export interface RenderViewport {
  width: number;
  height: number;
}

export interface RenderViewportMeasurer {
  measure(host: HTMLElement): RenderViewport | null;
}
