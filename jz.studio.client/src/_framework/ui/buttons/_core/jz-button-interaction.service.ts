import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JzButtonVisualState } from './jz-button-types';

@Injectable()
export class JzButtonInteractionService {
  private readonly _state = new BehaviorSubject<JzButtonVisualState>({
    disabled: false,
    hovered: false,
    pressed: false,
    focused: false,
    focusVisible: false,
    keyboardActive: false
  });

  readonly state$ = this._state.asObservable();

  get state(): JzButtonVisualState {
    return this._state.value;
  }

  setDisabled(disabled: boolean): void {
    this.patch({ disabled });

    if (disabled) {
      this.patch({
        hovered: false,
        pressed: false,
        focused: false,
        focusVisible: false,
        keyboardActive: false
      });
    }
  }

  onPointerEnter(): void {
    if (this.state.disabled) return;
    this.patch({ hovered: true });
  }

  onPointerLeave(): void {
    if (this.state.disabled) return;
    this.patch({
      hovered: false,
      pressed: false
    });
  }

  onPointerDown(): void {
    if (this.state.disabled) return;
    this.patch({ pressed: true });
  }

  onPointerUp(): void {
    if (this.state.disabled) return;
    this.patch({ pressed: false });
  }

  onPointerCancel(): void {
    if (this.state.disabled) return;
    this.patch({ pressed: false });
  }

  onFocus(fromKeyboard: boolean): void {
    if (this.state.disabled) return;

    this.patch({
      focused: true,
      focusVisible: fromKeyboard
    });
  }

  onBlur(): void {
    if (this.state.disabled) return;

    this.patch({
      focused: false,
      focusVisible: false,
      pressed: false,
      keyboardActive: false
    });
  }

  onKeyDown(key: string): boolean {
    if (this.state.disabled) return false;

    const isActivationKey = key === 'Enter' || key === ' ';
    if (!isActivationKey) return false;

    this.patch({
      pressed: true,
      keyboardActive: true,
      focusVisible: true
    });

    return true;
  }

  onKeyUp(key: string): boolean {
    if (this.state.disabled) return false;

    const isActivationKey = key === 'Enter' || key === ' ';
    if (!isActivationKey) return false;

    this.patch({
      pressed: false,
      keyboardActive: false
    });

    return true;
  }

  private patch(patch: Partial<JzButtonVisualState>): void {
    this._state.next({
      ...this._state.value,
      ...patch
    });
  }
}
