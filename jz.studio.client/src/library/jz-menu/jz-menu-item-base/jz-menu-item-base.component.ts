
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppEventsService } from '../../../app/app-services/app-events.service';
import { JzMenuService } from '../jz-menu.service';
import { JzPopOversService } from '../../jz-pop-overs/jz-pop-overs.service';

@Component({
  selector: 'j3-menu-item-base',
  templateUrl: './jz-menu-item-base.component.html',
  styleUrls: ['./jz-menu-item-base.component.css']
})
export class JzMenuItemBaseComponent implements OnInit, AfterViewChecked {

  @Input() menuName: string = 'not set';
  @Input() tabId: string = 'not set';
  @Input() state: string = 'not set';
  @Input() direction: string = 'not set';
  @Input() flexflow: string = 'not set';

  @Input() isDefault: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() isHorizontal: boolean = true;
//  @Input() isSubView: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private appEvents: AppEventsService,
    protected menuEvents: JzMenuService,
    private renderer: Renderer2,
    protected popups: JzPopOversService
  ) { }

  ngOnInit(): void { }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
