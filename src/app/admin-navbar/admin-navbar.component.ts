import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RouteChangeService } from '../route-change.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  visible = false;
  private tabChangeSubscription: Subscription;
  tab = "inventory";

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private routeChangeService: RouteChangeService,
    private dataService: DataService) {
      
    this.visible = this.router.url !== "/";
    this.tabChangeSubscription = this.dataService.tabChange$.subscribe((tab) => {
      this.changeTab(tab);
    });
  }

  ngOnInit() {
    this.routeChangeService.routeChange$.subscribe(() => {
      this.updateVisibility();
    });

    this.updateVisibility();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  private updateVisibility() {
    if (this.dataService.getUser() != undefined) {
      if (this.router.url !== "/" && this.dataService.getUser()?.roles === '["ROLE_ADMIN"]') {
        this, this.visible = true;
      } else {
        this, this.visible = false;
      }
    } else {
      this.router.navigate([""]);
    }
  }

  //-------------------------------------------------------
  // Expansionne la barre de navigation admin
  //-------------------------------------------------------
  openOffcanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  disconnect() {
    this.offcanvasService.dismiss();
    this.dataService.disconnectUser();
    this.visible = false;
    this.router.navigate([""]);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.tab = tab;
  }

  getStyles() {
    return {
      'background-color': '#333333',
      'border-left': '6px solid white'
    };
  }

}
