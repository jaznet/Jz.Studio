import { EventHandler } from "./EventHandler.js";
import { Point } from "./Point.js";
import { Dialog } from "./Dialog.js";
import { IMouseOrTouchEvent } from "./interfaces/IMouseOrTouchEvent.js";

/**
 * Listens for events on the [element] and notifies the [listener]
 * if an undock event has been invoked.  An undock event is invoked
 * when the user clicks on the event and drags is beyond the
 * specified [thresholdPixels]
 */
export class UndockInitiator {
    mouseUpHandler?: EventHandler;
    touchUpHandler?: EventHandler;
    mouseMoveHandler?: EventHandler;
    touchMoveHandler?: EventHandler;
    dragStartPosition!: Point;
    thresholdPixels: number;
    _enabled: boolean|undefined;
    mouseDownHandler?: EventHandler;
    touchDownHandler?: EventHandler;
    element: HTMLElement;
    _undockededCallback: (e: MouseEvent, dragOffset: Point) => Dialog;
    touchDownUndockedHandler!: EventHandler;

    constructor(element: Element, undockededCallback: (e: MouseEvent, dragOffset: Point) => Dialog, thresholdPixels: number=7) {
        if (!thresholdPixels) {
            thresholdPixels = 7;
        }

        this.element = element as HTMLElement;
        this._undockededCallback = undockededCallback;
        this.thresholdPixels = thresholdPixels;
        this._enabled = false;
    }

  private setupEventListeners(): void {
    this.element.addEventListener('mousedown', (e: MouseEvent) => {
      if (this._enabled && e.button === 0) { // Assuming left mouse button drag initiates undocking
        // Setup for dragging logic, perhaps initializing dragOffset
        // Remember to add mousemove and mouseup listeners to handle drag and drop
      }
    });

    // Additional logic to handle mousemove and mouseup for completing the undock process
  }

    get enabled(): boolean|undefined {
        return this._enabled;
    }
    set enabled(value: boolean|undefined) {
        this._enabled = value;
        if (this._enabled) {
            if (this.mouseDownHandler) {
                this.mouseDownHandler.cancel();
                delete this.mouseDownHandler;
            }
            if (this.touchDownHandler) {
                this.touchDownHandler.cancel();
                delete this.touchDownHandler;
            }

            this.mouseDownHandler = new EventHandler(this.element, 'mousedown', this.onMouseDown.bind(this));
            this.touchDownHandler = new EventHandler(this.element, 'touchstart', this.onMouseDown.bind(this), { passive: false });
        }
        else {
            if (this.mouseDownHandler) {
                this.mouseDownHandler.cancel();
                delete this.mouseDownHandler;
            }

            if (this.touchDownHandler) {
                this.touchDownHandler.cancel();
                delete this.touchDownHandler;
            }

            if (this.mouseUpHandler) {
                this.mouseUpHandler.cancel();
                delete this.mouseUpHandler;
            }

            if (this.touchUpHandler) {
                this.touchUpHandler.cancel();
                delete this.touchUpHandler;
            }

            if (this.mouseMoveHandler) {
                this.mouseMoveHandler.cancel();
                delete this.mouseMoveHandler;
            }

            if (this.touchMoveHandler) {
                this.touchMoveHandler.cancel();
                delete this.touchMoveHandler;
            }
        }
    }

    onMouseDown(e:any) {
        e.preventDefault();

        // Make sure we dont do this on floating dialogs
        if (this.enabled) {
            if (e.touches) {
                if (e.touches.length > 1)
                    return;
                e = e.touches[0];
            }

            if (this.mouseUpHandler) {
                this.mouseUpHandler.cancel();
                delete this.mouseUpHandler;
            }

            if (this.touchUpHandler) {
                this.touchUpHandler.cancel();
                delete this.touchUpHandler;
            }

            if (this.mouseMoveHandler) {
                this.mouseMoveHandler.cancel();
                delete this.mouseMoveHandler;
            }

            if (this.touchMoveHandler) {
                this.touchMoveHandler.cancel();
                delete this.touchMoveHandler;
            }

            this.mouseUpHandler = new EventHandler(window, 'mouseup', this.onMouseUp.bind(this));
            this.touchUpHandler = new EventHandler(window, 'touchend', this.onMouseUp.bind(this));
            this.mouseMoveHandler = new EventHandler(window, 'mousemove', this.onMouseMove.bind(this));
            this.touchMoveHandler = new EventHandler(window, 'touchmove', this.onMouseMove.bind(this));
            this.dragStartPosition = new Point(e.clientX, e.clientY);
        }
    }

    onMouseUp() {
        if (this.mouseUpHandler) {
            this.mouseUpHandler.cancel();
            delete this.mouseUpHandler;
        }

        if (this.touchUpHandler) {
            this.touchUpHandler.cancel();
            delete this.touchUpHandler;
        }

        if (this.mouseMoveHandler) {
            this.mouseMoveHandler.cancel();
            delete this.mouseMoveHandler;
        }

        if (this.touchMoveHandler) {
            this.touchMoveHandler.cancel();
            delete this.touchMoveHandler;
        }
    }

  onMouseMove(e: Event) {
    let touchDetails: IMouseOrTouchEvent | null = null;

    if (e instanceof MouseEvent) {
      touchDetails = { clientX: e.clientX, clientY: e.clientY };
    } else if (e instanceof TouchEvent && e.touches && e.touches.length > 0) {
      // Assuming you want to handle the first touch point for simplicity
      const firstTouch = e.touches[0];
      touchDetails = { clientX: firstTouch.clientX, clientY: firstTouch.clientY };
    }

    if (touchDetails) {
      // Now you can safely use touchDetails.clientX and touchDetails.clientY
      // Add your logic here that uses touchDetails
    }
  }


    _requestUndock(e:any) {
        let top = 0;
        let left = 0;
        let currentElement = this.element;
        
        do {
            top += currentElement.offsetTop || 0;
            left += currentElement.offsetLeft || 0;
            currentElement = currentElement.offsetParent as HTMLElement;
        } while (currentElement);

        let dragOffsetX = this.dragStartPosition.x - left;
        let dragOffsetY = this.dragStartPosition.y - top;
        let dragOffset = new Point(dragOffsetX, dragOffsetY);
        this._undockededCallback(e, dragOffset);
    }
}
