
import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationListenerService {

  constructor(private router: Router) {
    this.listenToRouterEvents();
  }

  private listenToRouterEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
       /* this.loadingIndicatorService.show();*/
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
      /*  this.loadingIndicatorService.hide();*/
      }
    });
  }
}
