import { ViewEncapsulation } from '@angular/compiler';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, HostBinding, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JzButtonComponent } from '../jz-button/jz-button.component';
import { JzMenuItemBaseComponent } from '../../jz-menu/jz-menu-item-base/jz-menu-item-base.component';

@Component({
  selector: 'jz-tab',
  templateUrl: './jz-tab.component.html',
  styleUrls: ['./jz-tab.component.css']
})
export class JzTabComponent extends JzMenuItemBaseComponent implements OnInit, AfterViewInit {

  @Input() route = "";
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
  _type: string = 'set not';
  tabRoute = 'home';
  _btn!: JzButtonComponent;
  button!: HTMLDivElement
  orient = 'v';
  
  override ngOnInit(): void { }

  override ngAfterViewInit(): void {
  
    this._btn = this.tabButtonRef;

    switch (this.orientation) {
      case 'horizontal':
   //     this._tab.nativeElement.classList.add('horizontal');
        break;
      case 'vertical':
    //    this._tab.nativeElement.classList.add('vertical');
        break;
    }

  }

  tabSelected() {
    console.log('tab ',this.route);
  }

}
