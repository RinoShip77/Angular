import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RouteChangeService } from '../route-change.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  visible = false;
  user: User = new User();

  @Output() connected = new EventEmitter<User>();
  @Output() disconnected = new EventEmitter<User>();
  @Output() openAdminInventory = new EventEmitter<User>();

  constructor(private offcanvasService: NgbOffcanvas, private router: Router, private routeChangeService: RouteChangeService, private dataService: DataService) { 
    this.visible = this.router.url !== "/";
}

ngOnInit() {
  this.routeChangeService.routeChange$.subscribe(() => {
    this.updateVisibility();
  });

  this.updateVisibility();
}

private updateVisibility() {
  this.visible = (this.router.url !== "/" && this.dataService.getUser()?.roles === '["ROLE_ADMIN"]');
}

  //-------------------------------------------------------
  // Affiche la barre de navigation admin
  //-------------------------------------------------------
  onConnect(user: User) {
    this.user = user;
    console.log(user);
  }

  //-------------------------------------------------------
  // Expansionne la barre de navigation admin
  //-------------------------------------------------------
  openOffcanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  //-------------------------------------------------------
  // Déconnecte l'admin
  //-------------------------------------------------------
  disconnect() {
    this.offcanvasService.dismiss();
    this.disconnected.emit(this.user);
    this.router.navigate([""]);
    this.visible = false;
  }

  //-------------------------------------------------------
  // Affiche l'inventaire admin
  //-------------------------------------------------------
  displayAdminInventory() {
    this.openAdminInventory.emit(this.user);
  }
  
}
