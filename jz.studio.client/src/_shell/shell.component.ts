// shell.component.ts

import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  DOCUMENT,
  AfterViewInit,
  inject,
  HostBinding
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet,  NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

import { NavigationListenerService } from './services/navigation-listener.service';
import { AppStateService } from './services/shell-state.service';
import { ShellContentComponent } from './shell-parts/shell-content/shell-content.component';
import { ShellFooterComponent } from './shell-parts/shell-footer/shell-footer.component';
import { ShellHeaderComponent } from './shell-parts/shell-header/shell-header.component';

import { JzNavService } from '../_framework/navigation/services/jz-nav.service';
import { ShellThemeService } from '../_framework/palette/services/shell-theme.service';
import { ShellMode } from './models/shell-mode';
import { ShellLayoutService } from './services/shell-layout.service';
import { JzButtonComponent } from '../_framework/ui/buttons/jz-button/jz-button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    ShellHeaderComponent,
    ShellFooterComponent,
    RouterOutlet,
    ShellContentComponent,
    JzButtonComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { static: true }) header!: ShellHeaderComponent;
  @ViewChild('content', { static: true }) content!: ShellContentComponent;
  @ViewChild('footer', { static: true }) footer!: ShellFooterComponent;
  @HostBinding('class.theme-ready')
  themeReady = false;

  private observer?: MutationObserver;

  private doc = inject(DOCUMENT);
  private pid = inject(PLATFORM_ID);

  activeItem$ = this.navService.activeItem$;
  themeState$ = this.shellTheme.themeState$;
  private destroy$ = new Subject<void>();

  constructor(
    public shellTheme: ShellThemeService,
    private router: Router,
    private shellLayout: ShellLayoutService,
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

    this.listenForShellModeChanges();
    this.listenForPaletteChanges();
    this.listenForHeaderVisibilityChanges();
    this.listenForThemeReady();

    if (isPlatformBrowser(this.pid)) {
      window.addEventListener('load', () => {
        const navEntry =
          performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (navEntry?.type === 'reload') {
          console.log('The page was reloaded.');
        } else {
          console.log('The page was loaded for the first time.');
        }
      });
    }
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

  private listenForShellModeChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        const shellMode = tree.queryParams['shell'];

        switch (shellMode) {
          case ShellMode.Showcase:
            this.shellLayout.setMode(ShellMode.Showcase);
            break;

          case ShellMode.Architecture:
            this.shellLayout.setMode(ShellMode.Architecture);
            break;

          case ShellMode.Development:
            this.shellLayout.setMode(ShellMode.Development);
            break;

          default:
            this.shellLayout.setMode(ShellMode.Development);
            break;
        }
      });
  }


  private listenForPaletteChanges(): void {
    this.navService.activeItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        if (!item?.palette) {
          return;
        }

        if (!this.shellTheme.hasPalette(item.palette)) {
          console.warn(`Nav item requested unknown palette: ${item.palette}`);
          return;
        }

        this.shellTheme.applyPalette(item.palette);
      });
  }

  private listenForHeaderVisibilityChanges(): void {
    this.appService.toggleHeaderEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        this.header.visibility = e === 'hide' ? 'collapse' : 'visible';
      });
  }

  private listenForThemeReady(): void {
    this.shellTheme.themeReady$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ready => {
        this.themeReady = ready;
      });
  }

  private onDxLicenseFound(el: HTMLElement): void {
    console.log('<dx-license> appeared:', el);
    console.log('is correct element?', el.tagName === 'DX-LICENSE');
  }
}
