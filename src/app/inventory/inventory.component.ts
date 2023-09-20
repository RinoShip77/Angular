import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../modele/User';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  user: User = new User();

  @Output() openProfile = new EventEmitter<User>();
  @Output() disconnected = new EventEmitter<User>();

  constructor(private electrolibSrv: ElectrolibService) { }

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  onConnect(user: User) {
    this.user = user;
  }

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  displayAllBooks() {
    this.electrolibSrv.getBooks().subscribe(
      tabBooks => {
        console.log(tabBooks);
      }
    );
  }
  
  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  displayProfile() {
    this.openProfile.emit(this.user);
  }

  //-------------------------------------------------------
  // Function to disconnect a user
  //-------------------------------------------------------
  disconnect() {
    this.disconnected.emit(this.user);
  }
}
