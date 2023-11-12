import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DataService } from '../data.service';
import { EncryptionService } from '../encryption.service';
import { ENCRYPTION_KEY } from '../util';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent {
  connectionVisible = true;
  createAccountVisible = false;
  temporaryUser: User = new User();
  user: User = new User();

  @Output() connected = new EventEmitter<User>();

  constructor(private electrolibService: ElectrolibService, private router: Router, private dataService: DataService, private Encryption: EncryptionService) { }

  //--------------------------------
  // Function to connect a user
  //--------------------------------
  connect(type: string) {
    // #region 2023-10-20 11:16 - Olivier Bourgault
    // Convert the "if" to a "switch" statement
    switch (type) {
      case 'credentials':
        if (this.temporaryUser.memberNumber.toString().length > 0 && this.temporaryUser.password.length > 0) {

          this.retrieveAccount();

        } else {
          alert('Erreur: Veuillez fournir les informations nécessaires.');
        }
        break;

      case 'cheatUser':
        this.temporaryUser.memberNumber = "11";
        this.temporaryUser.password = "11";
        this.retrieveAccount();
        break;

      case 'cheatAdmin':
        this.temporaryUser.memberNumber = "admin";
        this.temporaryUser.password = "admin";
        this.retrieveAccount();
        break;
    }
    // #endregion
  }

  //-------------------------------------------------------
  // Récupère un compte en base de données par les informations fournies
  //-------------------------------------------------------
  retrieveAccount() {
    // * Encrypte the password
    // * De-comment this line to encrypte
    // this.temporaryUser.password = this.Encryption.set(ENCRYPTION_KEY, this.temporaryUser.password);

    this.electrolibService.connection(this.temporaryUser).subscribe(
      connectedUser => {
        // #region 2023-10-29 12:50 - Olivier Bourgault
        // Check if the account is active before login
        if (connectedUser.roles.includes('ROLE_DEACTIVATE')) {
          alert('La connexion a échoué.');
        } else {
          if (connectedUser.memberNumber === this.temporaryUser.memberNumber &&
            connectedUser.password === this.temporaryUser.password) {

            if (connectedUser.roles === '["ROLE_ADMIN"]') {
              this.user = connectedUser;

              this.dataService.updateUser(this.user);

              this.connected.emit(this.user);
              this.changeTab('inventory');
              this.router.navigate(["adminInventory"]);

            } else {
              this.user = connectedUser;

              this.dataService.updateUser(this.user);

              this.router.navigate(["/inventory"]);
              //this.connected.emit(this.user);

            }
          } else {
            alert('Erreur: Informations de connexion incorrectes.');
          }
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

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }
}
