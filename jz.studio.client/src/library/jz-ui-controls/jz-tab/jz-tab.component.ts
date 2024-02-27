import { ViewEncapsulation } from '@angular/compiler';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, HostBinding, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JzButtonComponent } from '../jz-button/jz-button.component';
import { JzMenuItemBaseComponent } from '../jz-menu/jz-menu-item-base/jz-menu-item-base.component';
import { AppEventsService } from '../../../app/app-services/app-events.service';
import { JzMenuService } from '../jz-menu/jz-menu.service';

@Component({
  selector: 'jz-tab',
  templateUrl: './jz-tab.component.html',
  styleUrls: ['./jz-tab.component.css']
})
export class JzTabComponent extends JzMenuItemBaseComponent implements OnInit, AfterViewInit {

  /*@HostBinding('class') classes = 'tab';*/
  @Input() route = "";
//  @Input() btn: J3ButtonComponent | undefined;
  @Input() btnTxt = "Tab Button";
  @Input() initialTemplate: TemplateRef<any> | any;
  @Input() orientation: string = '';
  @Input() override menuName: string = '';
  @Input() override state: string = '';
  @Input() tabBorder!: HTMLDivElement;
  @Input() menuType: string='notset';

  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any> | any;
  @ViewChild('tabBorder', { static: false }) tabBorderRef: ElementRef | any;
  @ViewChild('tabButton', { static: false }) tabButtonRef: ElementRef | any;

  currentTemplate: TemplateRef<any> | any;
 // _elementRef;
  _type: string = 'set not';
 // _jzTab: JzTabComponent;
 // _orientation: string;
  tabRoute = 'home';
 /* _tab!: any;*/
  _btn!: JzButtonComponent;
  button!: HTMLDivElement
  orient = 'v';
  override menuItem = 'login';
  
  override ngOnInit(): void { }

  override ngAfterViewInit(): void {
   // console.log(this.menuType);
   // console.log('JZTAB: ' + this.btnTxt + ' :  ' + this.orientation);
   // this._btn = this.btn;
 //   this._tab = this.tabBorderRef;
    this._btn = this.tabButtonRef;

    switch (this.orientation) {
      case 'horizontal':
   //     this._tab.nativeElement.classList.add('horizontal');
        break;
      case 'vertical':
    //    this._tab.nativeElement.classList.add('vertical');
        break;
    }

    //this._elementRef.nativeElement.classList.add('jztab');
    //if (this.orientation === 'vertical') {
    //  this._elementRef.nativeElement.classList.add('vertical');
    //} else if (this.orientation === 'horizontal') {
    //  this._elementRef.nativeElement.classList.add('vertical');
    //}
  
   
  //  this.button = this.tabButtonRef.background;

    if (this.state === 'selected') {
     // this.button.classList.add('selected');
    //  console.log(this.state);
    }
  }

  tabSelected() {
  //  menuService.menuItemSelected(this);
    console.log('tab ',this.route);
  }

}
