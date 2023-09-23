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
  @Output() adminConnected = new EventEmitter<User>();

  constructor(private electrolibService: ElectrolibService) { }

  //--------------------------------
  // Function to connect a user
  //--------------------------------
  connect(type: string) {
    if (type == "credentials") {
      if (this.temporaryUser.memberNumber.toString().length > 0 && this.temporaryUser.password.length > 0) {
        
        this.retrieveAccount();
        
      } else {
        alert('Erreur: Veuillez fournir les informations nécessaires.');
      }
    } else {
      this.temporaryUser.memberNumber = "admin";
      this.temporaryUser.password = "admin";
      this.retrieveAccount();
    }
  }

  retrieveAccount() {
    this.electrolibService.connection(this.temporaryUser).subscribe(
      connectedUser => {
        if (connectedUser.memberNumber === this.temporaryUser.memberNumber && 
          connectedUser.password === this.temporaryUser.password) {
          
            if (connectedUser.roles === '["ROLE_ADMIN"]') {
            this.visible = false;
            this.user = connectedUser;
            this.adminConnected.emit(this.user);
            
          } else {
            this.visible = false;
            this.user = connectedUser;
            this.connected.emit(this.user);
          } 
        } else {
          alert('Erreur: Informations de connexion incorrectes.');
        }
      }
    )
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
