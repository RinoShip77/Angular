import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  visible = false;
  user: User = new User();
  searchField: string = '';

  @Output() connected = new EventEmitter<User>();
  @Output() addSearchCriteria = new EventEmitter<string>();
  @Output() openProfile = new EventEmitter<User>();
  @Output() disconnected = new EventEmitter<User>();

  @Output() openBorrows = new EventEmitter<User>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private offcanvasService: NgbOffcanvas) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onNavbar(user: User) {
    this.visible = true;
    this.connected.emit(user);
    this.user = user;
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  addSearch() {
    this.addSearchCriteria.emit(this.searchField);
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  displayProfile() {
    this.openProfile.emit(this.user);
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  disconnect() {
    this.visible = false;
    this.disconnected.emit(this.user);
  }

  //---------------------------------
  // Function to expand the navbar
  //---------------------------------
  openOffcanvas(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  //
  // Function to open the borrows section
  borrows()
  {
    
    this.openBorrows.emit(this.user);
  }
}