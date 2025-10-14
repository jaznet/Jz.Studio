
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Host, HostBinding, OnInit, ViewChild } from '@angular/core';
import { AppStateService } from '../../app-services/app-state.service';
import { MainMenuComponent } from '../app-menus/main-menu/main-menu.component';
import { CommonModule } from '@angular/common';
import { PaletteMenuComponent } from '../app-menus/palette-menu/palette-menu.component';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MainMenuComponent, PaletteMenuComponent],
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit, AfterViewInit, AfterViewChecked {
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
