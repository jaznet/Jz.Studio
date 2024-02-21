
import { ChangeDetectorRef, Component, ElementRef, Host, HostBinding, ViewChild } from '@angular/core';
import { AppStateService } from '../../app-services/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  @HostBinding('class') classes = 'app-header';
  @ViewChild('mainMenuContainer') mainMenuContainer!: ElementRef;

  isVisible = 'collapse';
  isLogoVisible= 'collapse';
  isMainMenuVisible = 'collapse';

  constructor(private app: AppStateService, private changeDetector: ChangeDetectorRef,) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    this.isVisible = 'visible';
    this.isLogoVisible = 'visible';
    this.isMainMenuVisible = 'visible';

    this.app.toggleMenuEvent.subscribe((menu: any) => {
      this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse'; 
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
