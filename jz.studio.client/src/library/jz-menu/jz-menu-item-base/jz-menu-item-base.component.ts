import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppEventsService } from '../../../app/app-services/app-events.service';
import { JzMenuService } from '../jz-menu.service';

@Component({
  selector: 'j3-menu-item-base',
  templateUrl: './jz-menu-item-base.component.html',
  styleUrls: ['./jz-menu-item-base.component.css']
})
export class JzMenuItemBaseComponent implements OnInit, AfterViewInit {

  @Input() menuName: string = 'not set';
  @Input() tabId: string = 'not set';
  @Input() state: string = 'not set';
  @Input() direction: string = 'not set';
  @Input() flexflow: string = 'not set';
  @Input() isDefault: boolean = false;

  @Input() isSelected: boolean = false;
  @Input() isHorizontal: boolean = true;

  constructor(
    private elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private appEvents: AppEventsService,
    protected menuEvents: JzMenuService,
    private renderer:Renderer2
  ) { }

  ngOnInit(): void {
  //  console.log('direction:', this.direction);
  }

  ngAfterViewInit(): void {
    
    switch (this.direction) {
      case 'horizontal':
        this.flexflow = 'row';
        this.isHorizontal = true;
        break;
      case 'vertical':
        this.flexflow = 'column'; 
        this.isHorizontal = false; 
        break;
      default:
        this.flexflow = 'row';
        this.isHorizontal = true;
        break;
    }
  //  console.log('isHorizontal', this.isHorizontal);


  //  this.currentTemplate = this.initialTemplate;
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
