import { Component } from '@angular/core';
import { User } from '../model/User';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  visible = false;

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onFooter(user: User) {
    this.visible = true;
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  onDisconnect(user: User) {
    this.visible = false;
  }
}
