
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Host, HostBinding, OnInit, ViewChild } from '@angular/core';
import { AppStateService } from '../../services/shell-state.service';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from '../shell-menus/main-menu/main-menu.component';
import { PaletteMenuComponent } from '../shell-menus/palette-menu/palette-menu.component';

@Component({
  selector: 'shell-header',
    standalone:true,
    imports: [CommonModule, MainMenuComponent, PaletteMenuComponent],
    templateUrl: './shell-header.component.html',
    styleUrls: ['./shell-header.component.css']
})

export class ShellHeaderComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class') classes = 'app-header';
  @ViewChild('mainMenuContainer') mainMenuContainer!: ElementRef;

  visibility = 'collapse';
  isLogoVisible= 'collapse';
  isMainMenuVisible = 'collapse';

  constructor(private app: AppStateService, private changeDetector: ChangeDetectorRef,) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    this.visibility = 'visible';
    this.isLogoVisible = 'visible';
    this.isMainMenuVisible = 'visible';
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
