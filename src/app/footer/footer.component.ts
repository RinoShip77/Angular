import { Component } from '@angular/core';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { RouteChangeService } from '../route-change.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  visible = false;

  constructor(private router: Router, private routeChangeService: RouteChangeService) { 
    this.visible = this.router.url !== "/";
}

ngOnInit() {
  this.routeChangeService.routeChange$.subscribe(() => {
    this.updateVisibility();
  });

  this.updateVisibility();
}

private updateVisibility() {
  this.visible = this.router.url !== "/";
}

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onFooter(user: User) {
    this.visible = true;
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  onDisconnect(user: User) {
    this.visible = false;
  }
}
