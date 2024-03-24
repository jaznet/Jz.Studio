
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../library/jz-menu/jz-menu-base/jz-menu-base.component';

@Component({
  selector: 'sandbox-menu',
  templateUrl: './sandbox-menu.component.html',
  styleUrls: ['./sandbox-menu.component.css']
})
export class SandboxMenuComponent extends MenuBaseComponent implements AfterViewInit {
  /* @HostBinding('class') classes = 'fit-to-content';*/
  @Input() override menuName: string = '';

  override direction: string = 'vertical';
 // menu_name: string = 'sandbox'

  ngAfterViewInit(): void {
    
  }
}
