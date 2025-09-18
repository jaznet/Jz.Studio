//jz-button3d.component.ts
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common'; // brings NgClass, NgStyle, NgIf, NgFor, etc.

@Component({
  selector: 'jz-button3d',
  standalone: true,
  imports: [CommonModule],                 // ⬅️ this fixes NG8002 for ngClass/ngStyle
  templateUrl: './jz-button3d.component.html',
  styleUrls: ['./jz-button3d.component.css'] // ⬅️ plural
})
export class JzButton3dComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class') classes = 'fit-to-parent';

  // Use camelCase in TS, and bind to the same name in the template
  @Input() isSubMenu = false;
  @Input() isSelected = false;
  @Input() background: string | null = null;
  @Input() btnTextColor: string | null = null;
  @Input() text = 'Enter';
  //@Input() borderPx: number = 8;          // prefer number, bind with .px unit in template
  @Input() height = 32;      // px
  @Input() width = 120;     // px

  height_px: string = '0px';
  width_px: string = '0px';
  border_px: string = '0px';

  get borderPx(): number {
    return Math.round(this.height * 0.175);
  }

  menuType!: string;

  constructor() { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.height_px = this.height + 'px';
    this.width_px = this.width + 'px';
    this.border_px = .175 * this.height + 'px';
  //  console.log(this.menuType);
    if (this.menuType === 'sub-menu')
      this.isSubMenu = true;
    else
      this.isSubMenu = false;
    //   this.color = this.colorTxt;
    //this.background = this.btnBackground;
    //this.changeDetector.detectChanges();
  }
  ngAfterViewChecked(): void {
   
  }
}
