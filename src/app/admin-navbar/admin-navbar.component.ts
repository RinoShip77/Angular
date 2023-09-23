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

  constructor(private offcanvasService: NgbOffcanvas) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onAdminNavBar(user: User) {
    this.connected.emit(user);
    this.user = user;
    this.visible = true;
  }

  //---------------------------------
  // Function to expand the navbar
  //---------------------------------
  openOffcanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  disconnect() {
    this.visible = false;
    this.disconnected.emit(this.user);
  }
}
