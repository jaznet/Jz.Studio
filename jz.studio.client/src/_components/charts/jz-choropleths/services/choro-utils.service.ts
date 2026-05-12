
import { Injectable } from '@angular/core';
import getBounds from 'svg-path-bounds';

@Injectable({
  providedIn: 'root'
})
export class ChoroUtilsService {

  constructor() { }

  GetPathBounds(path: any) {
    const bounds = getBounds(path);
    return bounds;
  }
}
