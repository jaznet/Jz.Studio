import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../../services/shell-state.service';
import { PaletteMenuComponent } from '../shell-menus/palette-menu/palette-menu.component';
import { JzButtonComponent } from '../../../_framework/ui/buttons/jz-button/jz-button.component';
import { SolutionsMenuComponent } from '../shell-menus/solutions-menu/solutions-menu.component';

@Component({
  selector: 'shell-header',
  standalone: true,
  imports: [
    CommonModule,
    SolutionsMenuComponent,
    PaletteMenuComponent,
    JzButtonComponent
  ],
  templateUrl: './shell-header.component.html',
  styleUrls: ['./shell-header.component.css']
})
export class ShellHeaderComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class.app-header')
  appHeaderClass = true;

  @ViewChild('solutionMenuContainer') solutionMenuContainer!: ElementRef;

  @Output()
  shellCollapseToggled = new EventEmitter<void>();

  visibility = 'collapse';
  isLogoVisible = 'collapse';
  isMainMenuVisible = 'collapse';

  constructor(
    private app: AppStateService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.visibility = 'visible';
    this.isLogoVisible = 'visible';
    this.isMainMenuVisible = 'visible';
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  public toggleShellCollapse(): void {
    this.shellCollapseToggled.emit();
  }
}
