
import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[jzMathjax]'
})
export class JzMathJaxDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.renderMath();
  }

  renderMath() {
    if (window.MathJax) {
      window.MathJax.typesetPromise([this.el.nativeElement])
        .then(() => {
          console.log('MathJax typesetting completed');
        })
        .catch((err: any) => {
          console.error('MathJax typesetting error:', err);
        });
    }
  }

}
