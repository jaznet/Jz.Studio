
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';

@Component({
  selector: 'sandbox-menu',
  templateUrl: './sandbox-menu.component.html',
  styleUrls: ['./sandbox-menu.component.css']
})
export class SandboxMenuComponent extends MenuBaseComponent  {

  @Input() override menuName: string = '';

  override menuType: string = 'sub-menu';
  override direction: string = 'vertical';

 
}
