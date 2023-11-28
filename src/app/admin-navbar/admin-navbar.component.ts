import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RouteChangeService } from '../route-change.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { ElectrolibService } from '../electrolib.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  visible = false;
  private tabChangeSubscription: Subscription;
  tab = "inventory";
  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private routeChangeService: RouteChangeService,
    private dataService: DataService,
    private electrolibService: ElectrolibService) {
      
    this.visible = this.router.url !== "/";
    this.tabChangeSubscription = this.dataService.tabChange$.subscribe((tab) => {
      this.changeTab(tab);
    });
  }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.routeChangeService.routeChange$.subscribe(() => {
      this.updateVisibility();
    });

    this.updateVisibility();
  }

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  changeTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark');
      this.switchTheme.emit('dark');
    } else {
      localStorage.setItem('theme', 'light');
      this.switchTheme.emit('light');
    }
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
