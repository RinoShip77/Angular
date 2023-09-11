import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';
import { ElectrolibService } from '../electrolib.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  visible = false;
  fileName = '';
  user: User = new User();

  @Output() disconnected = new EventEmitter<User>();

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  constructor(private electrolib: ElectrolibService) { }

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  onProfile(user: User) {
    this.visible = true;
    this.user = user;

    console.log(user);
  }

  //-------------------------------------------------------
  // Function to disconnect a user
  //-------------------------------------------------------
  disconnect() {
    this.visible = false;
    this.disconnected.emit(this.user);
  }

  //-------------------------------------------------------
  // Function to upload a new profile picture
  //-------------------------------------------------------
  uploadImage() {
    console.log('new profile picture');
  }
  
  //-------------------------------------------------------
  // Open the inventory of this user
  //-------------------------------------------------------
  openInventory() {
    console.log('open inventory');
  }
  
  //-------------------------------------------------------
  // Open the borrow(s) mades by the user
  //-------------------------------------------------------
  openBorrows() {
    console.log('open borrows');
  }
  
  //-------------------------------------------------------
  // Open the favorites of the user
  //-------------------------------------------------------
  openFavorites() {
    console.log('open favorites');
  }

  //-------------------------------------------------------
  // Function to upload a new profile picture
  //-------------------------------------------------------
  updateProfile() {
    console.log('update profile ...\n');
    console.log(this.user);
  }
}