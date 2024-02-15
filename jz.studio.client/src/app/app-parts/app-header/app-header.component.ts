
import { Component, ElementRef, Host, HostBinding, ViewChild } from '@angular/core';
import { AppServices } from '../../app-services/app-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  @HostBinding('class') classes = 'app-header';
  @ViewChild('mainMenuContainer') mainMenuContainer!: ElementRef;

  isVisible = 'collapse';
  isLogoVisible: boolean = false;
  isMainMenuVisible: boolean = false;

  constructor(private app: AppServices) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.app.toggleMenuEvent.subscribe((menu: any) => {
      this.isLogoVisible = menu === 'show' ? true : false;
      this.isMainMenuVisible = menu === 'show' ? true : false;
    })
  }
}
