import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DataService } from '../data.service';
import { EncryptionService } from '../encryption.service';
import { ENCRYPTION_KEY } from '../util';
import { ToastService } from '../toast.service';
import { Borrow } from '../model/Borrow';

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

  constructor(private electrolibService: ElectrolibService, private router: Router, private dataService: DataService, private Encryption: EncryptionService, private toastService: ToastService) { }

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
        //this.temporaryUser.memberNumber = "11";
        //this.temporaryUser.password = "11";
        this.retrieveAccount()
      
        break;

      case 'cheatAdmin':
        this.temporaryUser.memberNumber = "admin";
        this.temporaryUser.password = "admin";
        //this.temporaryUser.memberNumber = "admin";
        //this.temporaryUser.password = "admin";
        this.retrieveAccount();
        break;
    }
    // #endregion
  }

  //-------------------------------------------------------
  // Récupère un compte en base de données par les informations fournies
  //-------------------------------------------------------
  async retrieveAccount() {
    // * Encrypte the password
    // * De-comment this line to encrypte
    // this.temporaryUser.password = this.Encryption.set(ENCRYPTION_KEY, this.temporaryUser.password);
    
    await this.electrolibService.connection(this.temporaryUser).subscribe(
      connectedUser => {
        
        try
        {
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

              this.alertLateness(this.user);

              this.router.navigate(["/inventory"]);
              
              //this.connected.emit(this.user);

            }
          } else {
            alert('Erreur: Informations de connexion incorrectes.');
            
          }
          
        }
        
        }
        catch (err)
        {
          alert("Utilisateur ou mot de passe incorrecte");
          
        }
       
      },
      error => {alert("Erreur de serveur. Veuillez réésayer dans quelques instants");}
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

  borrows: Borrow[] = new Array();

  //Cherche tous les emprunts en bd
  //et vérifie s'il y a des retards
  //Ensuite, affiche les retards avec un toast
  async alertLateness(user: User)
  {
    if(this.user)
    {
      await this.electrolibService.getBorrowsFromUser(user).subscribe(
        borrows => {
          this.borrows = borrows.map(x => (Object.assign(new Borrow(), x)));

          this.borrows.forEach(borrow => 
            {
              if(borrow.calculateFee()! > 0 || borrow.calculateFee() != null)
              {
                console.log(borrow.calculateFee());
                
                if(borrow.transformTimeAndLate() == 1)
                {
                  this.toastService.show('Votre emprunt (' + borrow.book.title + ') a ' + borrow.transformTimeAndLate() + ' journée de retard', {
                    classname: 'bg-danger',
                  });
                }
                else if (borrow.transformTimeAndLate() > 1)
                {
                  this.toastService.show('Votre emprunt (' + borrow.book.title + ') a ' + borrow.transformTimeAndLate() + ' jours de retard', {
                    classname: 'bg-danger',
                  });
                }
                else if (borrow.transformTimeAndLate() == 0)
                {
                  this.toastService.show('Votre emprunt (' + borrow.book.title + ') a 1 journée de retard', {
                    classname: 'bg-danger',
                  });
                }
              }
              
              if(borrow.transformTimeAndLate() <= 7 && borrow.determineStatus() != 'En retard')
              {
                console.log(borrow.calculateFee());
                
                if(borrow.transformTimeAndLate() == 1)
                {
                  this.toastService.show('Il reste ' + borrow.transformTimeAndLate() + ' journée à votre emprunt ('+ borrow.book.title + ')', {
                    classname: 'bg-warning',
                  });
                }
                else
                {
                  this.toastService.show('Il reste ' + borrow.transformTimeAndLate() + ' jours à votre emprunt ('+ borrow.book.title + ')', {
                    classname: 'bg-warning',
                  });
                }
              }
            });
        }
      );
    }
  }
}
