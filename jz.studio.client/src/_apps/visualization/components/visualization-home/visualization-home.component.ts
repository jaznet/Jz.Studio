// visualization-home.component.ts

import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DOCUMENT, HostBinding, inject, Inject, PLATFORM_ID } from '@angular/core';
import { JzButtonComponent } from 'jz-ui';

@Component({
  selector: 'visualization-home',
  standalone: true,
  imports: [JzButtonComponent],
  templateUrl: './visualization-home.component.html',
  styleUrl: './visualization-home.component.css',

})
export class VisualizationHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  popoverVisible = true;
  anchor!: HTMLElement;

  private doc = inject(DOCUMENT);
  private pid = inject(PLATFORM_ID);

  constructor(
  
  ) {
 //    palette.ChangePalette('protan');
  }

  ngAfterViewInit(): void {
    const element = this.doc.querySelector<HTMLElement>('dx-license');
    if (element)
      element.remove();
  }



  toggle(el: HTMLElement) {
    this.anchor = el;               // ← provide the target element
    this.popoverVisible = !this.popoverVisible;
  }

}
