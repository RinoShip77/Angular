import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent {
  visible = true;
  connectionVisible = true;
  createAccountVisible = false;
  temporaryUser: User = new User();
  user: User = new User();

  @Output() connected = new EventEmitter<User>();

  constructor(private electrolibService: ElectrolibService) { }

  //--------------------------------
  // Function to connect a user
  //--------------------------------
  connect() {
    // this.user.email = 'user@electrolib.com';
    // this.user.password = '1234';
    if (this.temporaryUser.email.length == 0 && this.temporaryUser.password.length == 0) {
      this.temporaryUser.email == "aa";
      this.temporaryUser.password == "aa";
      /*this.electrolibService.connection(this.temporaryUser).subscribe(
        connectedUser => {
          this.visible = false;
          this.user = connectedUser;
          this.connected.emit(this.user);
        }
      )*/
      this.visible = false;
      this.connected.emit(this.user);
    } else {
      alert('Please fill both fields');
    }
  }

  //--------------------------------
  // Fonction to display the form to create an account
  //--------------------------------
  createAccount() {
    this.connectionVisible = false;
    this.createAccountVisible = true;
  }

  //--------------------------------
  // Function to validate an account
  //--------------------------------
  validateCreateAccount() {
    console.log('account ' + this.user.firstName + ' created');
  }

  //--------------------------------
  // Function to validate an account
  //--------------------------------
  cancelCreationAccount() {
    this.connectionVisible = true;
    this.createAccountVisible = false;
  }
}
