
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { JzMenuService } from '../../jz-menu/jz-menu.service';

@Component({
  selector: 'jz-button',
  templateUrl: './jz-button.component.html',
  styleUrls: ['./jz-button.component.css']
})
export class JzButtonComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class') classes = 'fit-to-content';

  @Input() route: string = '';
  
  @Input() text: string = 'Enter';
  @Input() height: number = 33;
  @Input() width: number = 100;
  @Input() colorTxt: string = 'var(--plt-clr-5)';
  @Input() colorBkg: string = 'var(--plt-clr-1)';
  @Input() fontSize: string = '14px';
  @Input() isSelected: boolean = false;
  @Input() menuType!: string;

  isSubMenu: boolean = false;
  height_px: string = '0px';
  width_px: string = '0px';
  border_px: string = '0px';
  color!: string;
  background!: string;

  get parentGetter() {
    return this.menuType;
   // return this.menuService.isSubMenu;
  }

  get isSelectedGetter() {
    return this.isSelected;
  }

  constructor(
    private menuService: JzMenuService,
    private changeDetector: ChangeDetectorRef,
    private element: ElementRef,
    private renderer: Renderer2,
    private router: Router) {
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.height_px = this.height + 'px';
    this.width_px = this.width + 'px';
    this.border_px = .175 * this.height + 'px';
    this.color = this.colorTxt;
    this.background = this.colorBkg;
    this.changeDetector.detectChanges();
    console.log('button parent tab', this.menuType);
    if (this.menuType === 'sub-menu') {
      this.isSubMenu = true;
    }
  }

  ngAfterViewChecked(): void { }

  onClicked() {
   // this.selection('select');
    // console.log(this.element.nativeElement);
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }

  selection(select: string) {
    switch (select) {
      case 'select': {
        this.renderer.addClass(this.element.nativeElement.firstChild, 'selected');
        break;
      }
      case 'deselect': {
        this.renderer.removeClass(this.element.nativeElement.firstChild, 'selected');
        break;
      }
    }
  }
}
