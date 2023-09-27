import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteChangeService {
  
  constructor(private router: Router) { }

  routeChange$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  );
}
