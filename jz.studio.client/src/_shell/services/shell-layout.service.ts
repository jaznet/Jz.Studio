import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShellMode } from '../models/shell-mode';

@Injectable({
  providedIn: 'root'
})
export class ShellLayoutService {
  private readonly modeSubject =
    new BehaviorSubject<ShellMode>(ShellMode.Development);

  readonly mode$ = this.modeSubject.asObservable();

  setMode(mode: ShellMode): void {
    this.modeSubject.next(mode);
  }

  get mode(): ShellMode {
    return this.modeSubject.value;
  }

  get isShowcase(): boolean {
    return this.modeSubject.value === ShellMode.Showcase;
  }

  get isDevelopment(): boolean {
    return this.modeSubject.value === ShellMode.Development;
  }

  get isArchitecture(): boolean {
    return this.modeSubject.value === ShellMode.Architecture;
  }
}
