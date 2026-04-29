/* button-base.ts*/

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonInteractionService } from '../_core/button-interaction.service';
import { JzButtonVisualState } from '../_core/jz-button-state.model';
import { JzButtonSize, JzButtonVariant } from '../_core/jz-button-types';

@Component({
  selector: 'button-base',
  standalone: true,
  templateUrl: './button-base.html',
  styleUrls: ['./button-base.scss'],
  providers: [ButtonInteractionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonBaseComponent implements OnChanges, OnDestroy {

  private _disabled = false;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.interaction.setDisabled(value);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  private _active = false;
  @Input()
  set active(value: boolean) {
    this._active = value;

    // optional: hook later if needed
    // this.interaction.setActive(value);
  }

  get active(): boolean {
    return this._active;
  }

 // @Input() jzDisabled = false;
  @Input() variant: JzButtonVariant = 'primary';
  @Input() size: JzButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() activated = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<MouseEvent>();

  isDisabled = false;
  isHovered = false;
  isPressed = false;
  isFocused = false;
  isFocusVisible = false;

  private keyboardMode = false;
  private readonly subscription: Subscription;

  constructor(
    protected readonly interaction: ButtonInteractionService
  ) {
    this.subscription = this.interaction.state$.subscribe(state => {
      this.applyState(state);
    });

    this.interaction.setDisabled(this._disabled);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jzDisabled']) {
      this.interaction.setDisabled(this._disabled);
    }
  }



  onClick(event: MouseEvent): void {
    if (this._disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (!this.interaction.state.keyboardActive) {
      this.emitActivation();
    }
  }

  protected onBaseClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }

  protected emitActivation(): void {
    if (!this._disabled) {
      this.activated.emit();
    }
  }

  onPointerEnter(): void {
    this.interaction.onPointerEnter();
  }

  onPointerLeave(): void {
    this.interaction.onPointerLeave();
  }

  onPointerDown(event: PointerEvent): void {
    if (this._disabled) {
      event.preventDefault();
      return;
    }

    this.keyboardMode = false;
    this.interaction.onPointerDown();
  }

  onPointerUp(): void {
    this.interaction.onPointerUp();
  }

  onPointerCancel(): void {
    this.interaction.onPointerCancel();
  }

  onFocus(): void {
    this.interaction.onFocus(this.keyboardMode);
  }

  onBlur(): void {
    this.interaction.onBlur();
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keyboardMode = true;

    const handled = this.interaction.onKeyDown(event.key);
    if (handled && event.key === ' ') {
      event.preventDefault();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    const handled = this.interaction.onKeyUp(event.key);

    if (handled) {
      event.preventDefault();
      this.emitActivation();
    }
  }

  onMouseDown(): void {
    this.keyboardMode = false;
  }



  private applyState(state: JzButtonVisualState): void {
    this.isDisabled = state.disabled;
    this.isHovered = state.hovered;
    this.isPressed = state.pressed;
    this.isFocused = state.focused;
    this.isFocusVisible = state.focusVisible;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
