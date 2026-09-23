import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JzPopoverPanelComponent } from '../jz-popover-panel/jz-popover-panel.component';

@Component({
  selector: 'jz-popover-loading',
  standalone: true,
  imports: [
    CommonModule,
    JzPopoverPanelComponent
  ],
  templateUrl: './jz-popover-loading.component.html',
  styleUrls: ['./jz-popover-loading.component.scss']
})
export class JzPopoverLoadingComponent {
}
