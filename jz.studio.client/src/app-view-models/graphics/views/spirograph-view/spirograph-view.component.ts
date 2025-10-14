
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { JzSpirographComponent } from '../../../../library/jz-spirograph/jz-spirograph.component';

@Component({
    selector: 'spirograph-view',
    imports: [CommonModule, JzSpirographComponent],
    templateUrl: './spirograph-view.component.html',
    styleUrl: './spirograph-view.component.css'
})
export class SpirographViewComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
