import { Component } from '@angular/core';
import { User } from '../modele/User';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  visible = false;

  //-------------------------------------------------------
  // Function to display every book in the database
  //-------------------------------------------------------
  onConnect(user: User) {
    this.visible = true;
  }
}
