// app.component.ts

import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  DOCUMENT,
  AfterViewInit,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NavigationListenerService } from './services/navigation-listener.service';
import { AppStateService } from './services/shell-state.service';
import { ShellContentComponent } from './shell-parts/shell-content/shell-content.component';
import { ShellFooterComponent } from './shell-parts/shell-footer/shell-footer.component';
import { ShellHeaderComponent } from './shell-parts/shell-header/shell-header.component';

import { JzNavService } from '../_framework/navigation/services/jz-nav.service';
import { ShellThemeService } from '../_framework/palette/services/shell-theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    ShellHeaderComponent,
    ShellFooterComponent,
    RouterOutlet,
    ShellContentComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { static: true }) header!: ShellHeaderComponent;
  @ViewChild('content', { static: true }) content!: ShellContentComponent;
  @ViewChild('footer', { static: true }) footer!: ShellFooterComponent;

  private observer?: MutationObserver;

  private doc = inject(DOCUMENT);
  private pid = inject(PLATFORM_ID);

  activeItem$ = this.navService.activeItem$;
  private destroy$ = new Subject<void>();

  constructor(
    private shellTheme: ShellThemeService,
    private router: Router,
    private appService: AppStateService,
    private navService: JzNavService,
    private navigationListenerService: NavigationListenerService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.header);
    console.log(this.content);
    console.log(this.footer);

    this.shellTheme.initializeTheme();

    this.navService.activeItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        console.log('ACTIVE NAV ITEM:', item);

        if (item?.palette) {
          this.shellTheme.applyPalette(item.palette);
        }
      });

    window.addEventListener('load', () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navEntry?.type === 'reload') {
        console.log('The page was reloaded.');
      } else {
        console.log('The page was loaded for the first time.');
      }
    });

    this.appService.toggleHeaderEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        this.header.visibility = e === 'hide' ? 'collapse' : 'visible';
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.pid)) return;

    // const element = this.doc.querySelector<HTMLElement>('dx-license');
    // if (element) {
    //   element.remove();
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.observer?.disconnect();
  }

  private onDxLicenseFound(el: HTMLElement): void {
    console.log('<dx-license> appeared:', el);
    console.log('is correct element?', el.tagName === 'DX-LICENSE');
  }
}
