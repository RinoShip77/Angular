import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private offcanvasService: NgbOffcanvas) { }

  //-------------------------------------------------------
  // Affiche la barre de navigation admin
  //-------------------------------------------------------
  onAdminNavBar(user: User) {
    this.connected.emit(user);
    this.user = user;
    this.visible = true;
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
    this.visible = false;
    this.disconnected.emit(this.user);
  }

  //-------------------------------------------------------
  // Affiche l'inventaire admin
  //-------------------------------------------------------
  displayAdminInventory() {
    this.openAdminInventory.emit(this.user);
  }
  
}
