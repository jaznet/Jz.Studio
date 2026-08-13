import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class JzPopoverRef {
  private readonly closedSubject = new Subject<unknown>();

  readonly afterClosed$: Observable<unknown> =
    this.closedSubject.asObservable();

  constructor(private readonly overlayRef: OverlayRef) { }

  close(result?: unknown): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef.dispose();

    this.closedSubject.next(result);
    this.closedSubject.complete();
  }

  updatePosition(): void {
    this.overlayRef.updatePosition();
  }

  hasAttached(): boolean {
    return this.overlayRef.hasAttached();
  }
}
