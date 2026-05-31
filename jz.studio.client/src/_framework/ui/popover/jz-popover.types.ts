import { ConnectedPosition } from '@angular/cdk/overlay';

export type JzPopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'top'
  | 'left'
  | 'right';

export interface JzPopoverConfig {
  placement?: JzPopoverPlacement;
  hasBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];
}

export function getJzPopoverPositions(
  placement: JzPopoverPlacement = 'bottom-start'
): ConnectedPosition[] {
  switch (placement) {
    case 'bottom-start':
      return [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
      ];

    case 'bottom-end':
      return [
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' }
      ];

    case 'top-start':
      return [
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
      ];

    case 'top-end':
      return [
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
      ];

    case 'bottom':
      return [
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }
      ];

    case 'top':
      return [
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' }
      ];

    case 'left':
      return [
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' }
      ];

    case 'right':
      return [
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' }
      ];
  }
}
