import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  visible = false;

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  onConnect(user: User) {
    this.visible = true;
  }
}