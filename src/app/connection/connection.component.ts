import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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

  constructor(private electrolibService: ElectrolibService,private route: ActivatedRoute,private router: Router) { }

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
      this.temporaryUser.memberNumber = "123";
      this.temporaryUser.password = "11";
      this.retrieveAccount();
    }
  }

  //-------------------------------------------------------
  // Récupère un compte en base de données par les informations fournies
  //-------------------------------------------------------
  retrieveAccount() {
    this.electrolibService.connection(this.temporaryUser).subscribe(
      connectedUser => {
        if (connectedUser.memberNumber === this.temporaryUser.memberNumber && 
          connectedUser.password === this.temporaryUser.password) {
          
            if (connectedUser.roles === '["ROLE_ADMIN"]') {
            this.visible = false;
            this.user = connectedUser;
            this.router.navigate(["/adminInventory"]);
            this.adminConnected.emit(this.user);
            
          } else {
            this.visible = false;
            this.user = connectedUser;
            this.router.navigate(["/inventory"]);
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
