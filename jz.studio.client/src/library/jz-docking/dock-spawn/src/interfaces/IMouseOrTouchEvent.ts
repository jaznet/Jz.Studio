interface TouchDetails {
  clientX: number;
  clientY: number;
  // include other properties from Touch objects you need
}

export interface IMouseOrTouchEvent {
  clientX: number;
  clientY: number;
  changedTouches?: TouchDetails[];
  touches?: TouchDetails[];
}
