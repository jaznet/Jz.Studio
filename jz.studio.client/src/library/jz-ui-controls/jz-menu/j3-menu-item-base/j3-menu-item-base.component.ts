import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppEventsService } from '../../../../app/app-services/app-events.service';
import { JzMenuService } from '../jz-menu.service';

@Component({
  selector: 'j3-menu-item-base',
  templateUrl: './j3-menu-item-base.component.html',
  styleUrls: ['./j3-menu-item-base.component.css']
})
export class MenuItemBaseComponent implements OnInit, AfterViewInit {

  @Input() menuItemName: string = 'not set';
  @Input() menuItem: string = 'not set';
  @Input() state: string = 'not set';
  @Input() direction: string = 'not set';
  @Input() flexflow: string = 'not set';
  @Input() isDefault: boolean = false;

  selected: boolean = false;
  menuItemType!: string;

  constructor(
    private elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private appEvents: AppEventsService,
    private menuEvents: JzMenuService,
    private renderer:Renderer2
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    console.log("zmenu:", this.menuItemName, '-', this.direction);
    switch (this.direction) {
      case 'horizontal':
        this.flexflow = 'row';
        break;
      case 'vertical':
        this.flexflow = 'column';
        console.log(this.elementRef.nativeElement);
        break;
      default:
        // this.flex = 'row';
        break;
    }

    this.appEvents.viewSelectedEvent.subscribe((view: any) => {
    //  this.renderer.addClass(this.menuPanelRef.nativeElement, view);
    });

    this.menuEvents.menuItemSelectedEvent.subscribe((selectedItem: MenuItemBaseComponent) => {
  //    this.onMenuItemSelected(selectedItem);
    });

    this.menuEvents.menuItemDeselectedEvent.subscribe((selectedItem: MenuItemBaseComponent) => {
 //     this.onMenuItemSelected(selectedItem);
    });

  //  this.currentTemplate = this.initialTemplate;
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
