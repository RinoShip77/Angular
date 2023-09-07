import { Component } from '@angular/core';
import { User } from '../modele/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  visible = false;
  user: User = new User();

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  onProfile(user: User) {
    this.visible = true;
    this.user = user;
  }

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  goBack() {
    console.log('back');
  }
}
