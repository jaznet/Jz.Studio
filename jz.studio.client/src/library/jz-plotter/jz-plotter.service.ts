import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JzPlotterService {

   radianValues = [
    { val: Math.PI / 4, label: "$$\\frac{\\pi}{4}$$" },
    { val: Math.PI / 2, label: "$$\\frac{\\pi}{2}$$" },
    { val: (3 * Math.PI) / 4, label: "$$\\frac{3\\pi}{4}$$" },
    { val: Math.PI, label: "$$\\pi$$" },
    { val: (5 * Math.PI) / 4, label: "$$\\frac{5\\pi}{4}$$" },
    { val: (3 * Math.PI) / 2, label: "$$\\frac{3\\pi}{2}$$" },
    { val: (7 * Math.PI) / 4, label: "$$\\frac{7\\pi}{4}$$" },
    { val: 2 * Math.PI, label: "$$2\\pi$$" }
  ];

  constructor() { }
}
