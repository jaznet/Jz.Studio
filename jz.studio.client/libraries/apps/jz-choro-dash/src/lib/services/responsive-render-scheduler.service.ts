export class ResponsiveRenderScheduler {

  private resizeObserver?: ResizeObserver;
  private renderFrame?: number;

  constructor(private readonly render: () => void) { }

  observe(host: HTMLElement): void {
    this.resizeObserver?.disconnect();

    this.resizeObserver = new ResizeObserver(() => {
      this.schedule();
    });

    this.resizeObserver.observe(host);
  }

  schedule(): void {
    if (this.renderFrame !== undefined) {
      cancelAnimationFrame(this.renderFrame);
    }

    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = undefined;
      this.render();
    });
  }

  destroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

    if (this.renderFrame !== undefined) {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = undefined;
    }
  }
}
