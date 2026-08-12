import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type JzPopoverPanelVariant =
  | 'default'
  | 'loading'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

@Component({
  selector: 'jz-popover-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-popover-panel.component.html',
  styleUrls: ['./jz-popover-panel.component.scss']
})
export class JzPopoverPanelComponent {

  @Input()
  title = '';

  @Input()
  icon = '';

  @Input()
  variant: JzPopoverPanelVariant = 'default';

  @Input()
  showFooter = false;

}
