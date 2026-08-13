import { InjectionToken } from '@angular/core';
import { JzPopoverRef } from './jz-popover-ref';

export const JZ_POPOVER_DATA = new InjectionToken<unknown>('JZ_POPOVER_DATA');
export const JZ_POPOVER_REF = new InjectionToken<JzPopoverRef>('JZ_POPOVER_REF');
