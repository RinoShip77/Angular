import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent {
  visible = false;
  user: User = new User();

  @Output() openInventory = new EventEmitter<User>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onBorrow(user: User) {
    this.visible = true;
    this.user = user;
  }

  //---------------------------------
  // Open the inventory of this user
  //---------------------------------
  displayInventory() {
    this.visible = false;
    this.openInventory.emit(this.user);
  }
}
