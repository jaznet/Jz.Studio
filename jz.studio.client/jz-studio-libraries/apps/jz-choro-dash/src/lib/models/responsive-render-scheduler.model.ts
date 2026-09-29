export interface RenderScheduler {
  observe(host: HTMLElement): void;
  schedule(): void;
  destroy(): void;
}
