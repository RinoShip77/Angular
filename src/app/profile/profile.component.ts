import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  visible = false;
  user: User = new User();

  @Output() disconnected = new EventEmitter<User>();

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
    console.log(user);
  }
  
  //-------------------------------------------------------
  // Function to disconnect a user
  //-------------------------------------------------------
  disconnect() {
    this.visible = false;
    this.disconnected.emit(this.user);
  }
}
