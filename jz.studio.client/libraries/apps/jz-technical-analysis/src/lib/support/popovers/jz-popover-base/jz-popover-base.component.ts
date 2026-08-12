import { Component, Input } from '@angular/core';
import { JzPopoverPanelComponent } from '../jz-popover-panel/jz-popover-panel.component';

@Component({
  selector: 'jz-popover-base',
  standalone: true,
  imports: [JzPopoverPanelComponent],
  templateUrl: './jz-popover-base.component.html',
  styleUrl: './jz-popover-base.component.scss'
})
export class JzPopoverBaseComponent {
  @Input() title = '';
}
