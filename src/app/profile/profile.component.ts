import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';
import { ElectrolibService } from '../electrolib.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  visible = true;
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
    
    if(user.roles == '["ROLES_USER"]') {
      user.roles = 'Membre';
    } else {
      user.roles = 'Administrateur';
    }
    
    this.user = user;
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
  // Function to upload a new profile picture
  //-------------------------------------------------------
  updateProfile() {
    console.log('update profile ...\n');
    console.log(this.user);
  }
}