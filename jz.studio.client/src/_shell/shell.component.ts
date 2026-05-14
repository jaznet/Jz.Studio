//app.component.ts

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, PLATFORM_ID, DOCUMENT, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, inject } from '@angular/core';
import {  isPlatformBrowser } from '@angular/common';
import { PaletteMgrService } from './services/palette-mgr.service';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationListenerService } from './services/navigation-listener.service';
import { AppStateService } from './services/shell-state.service';
import { ShellContentComponent } from './shell-parts/shell-content/shell-content.component';
import { ShellFooterComponent } from './shell-parts/shell-footer/shell-footer.component';
import { ShellHeaderComponent } from './shell-parts/shell-header/shell-header.component';
import { JzNavService } from '../_framework/navigation/services/jz-nav.service';
import { Subject, takeUntil } from 'rxjs';


interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-shell',
  standalone:true,
  imports: [ShellHeaderComponent, ShellFooterComponent, RouterOutlet,  ShellContentComponent ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})

export class ShellComponent implements OnInit {
  @ViewChild('header', { static: true }) header!: ShellHeaderComponent;
  @ViewChild('content', { static: true }) content!: ShellContentComponent;
  @ViewChild('footer', { static: true }) footer!: ShellFooterComponent;

  private observer?: MutationObserver;
  public forecasts: WeatherForecast[] = [];

  private doc = inject(DOCUMENT);
  private pid = inject(PLATFORM_ID);

  activeItem$ = this.navService.activeItem$;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private appService: AppStateService,
    private navService: JzNavService,
    private navigationListenerService: NavigationListenerService,
    private http: HttpClient,
    private paletteService: PaletteMgrService
  )
  {
//    palette.ChangePalette("cofffee'");
  }

  ngOnInit() {
    console.log(this.header);
    console.log(this.content);
    console.log(this.footer);

    this.navService.activeItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        if (item?.palette) {
          // this.paletteService.setPalette(item.palette);
          console.log('ACTIVE NAV ITEM:', item);
          if (item?.palette) {
            this.paletteService.changePalette(item.palette);
          }
        }
      });

    this.paletteService.InitializePalette();

    window.addEventListener("load", function () {
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        console.log("The page was reloaded.");
      } else {
        console.log("The page was loaded for the first time.");
      }
    });

    this.appService.toggleHeaderEvent.subscribe((e) => {
      this.header.visibility = e === 'hide' ? 'collapse' : 'visible';
    })

    //this.popupsService.popUpEvent.subscribe((event: any) => {
    //  this.popup.isPopupVisible = true;
    //  console.log(this.popup);
    //})

    //this.popupsService.popoverEvent.subscribe((event: any) => {
    //  this.popover.isPopupVisible = true;
    //  console.log(this.popover);
    //})
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;

    // const element = this.doc.querySelector<HTMLElement>('dx-license');
    // if (element) {
    //   element.remove();
    // }
  }

  ngOnDestroy() {
    //  this.observer?.disconnect();
  }

  private onDxLicenseFound(el: HTMLElement) {
    console.log('<dx-license> appeared:', el);
    // read-only identification:
    console.log('is correct element?', el.tagName === 'DX-LICENSE');
  }
}
