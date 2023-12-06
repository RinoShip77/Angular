import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DataService } from '../data.service';
import { EncryptionService } from '../encryption.service';
import { ENCRYPTION_KEY } from '../util';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { Borrow } from '../model/Borrow';
import { timer } from "rxjs";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnDestroy {
  temporaryUser: User = new User();
  user: User = new User();
  error = false;
  otherError = false;
  loading = false;
  errorMessage = "";
  date = new Date();

  @Output() connected = new EventEmitter<User>();

  counter: number | undefined;
  timerRef: any;
  running: boolean = false;
  startText = 'Start';

  constructor(private electrolibService: ElectrolibService, private router: Router, private dataService: DataService, private Encryption: EncryptionService, private toastService: ToastService) { }

  //--------------------------------
  // Function to connect a user
  //--------------------------------
  connect() {
    if (this.temporaryUser.memberNumber.length > 0 && this.temporaryUser.password.length > 0) {

      this.retrieveAccount();
    } else {
      this.errorMessage = "Les informations de connexion sont incorrectes";
      this.error = true;
    }
  }

  //-------------------------------------------------------
  // Récupère un compte en base de données par les informations fournies
  //-------------------------------------------------------
  retrieveAccount() {
    // * Encrypte the password
    // * De-comment this line to encrypte
    // this.temporaryUser.password = this.Encryption.set(ENCRYPTION_KEY, this.temporaryUser.password);
    this.resetError();
    this.loading = true;

    this.electrolibService.connection(this.temporaryUser).subscribe(
      connectedUser => {


        // #region 2023-10-29 12:50 - Olivier Bourgault
        // Check if the account is active before login
        if (connectedUser.roles.includes('["ROLE_DEACTIVATE"]')) {
          this.errorMessage = "Le compte est désactivé";
          this.otherError = true;
          this.loading = false;
          return 0;
        }

        if (connectedUser.memberNumber === this.temporaryUser.memberNumber &&
          connectedUser.password === this.temporaryUser.password) {
          console.log("user correct");
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

            this.alertLateness(this.user);
          }
        } else {
          this.loading = false;
          this.errorMessage = "Les informations de connexion sont incorrectes";
          this.error = true;
        }
        return 0;
      },
      error => {
        console.error('An error occurred:', error);
        if (error.status === 400) {
          this.loading = false;
          this.errorMessage = "Les informations de connexion sont incorrectes";
          this.error = true;
        }
        else {
          this.loading = false;
          this.errorMessage = "Impossible d'effectuer la connexion";
          this.otherError = true;
        }
      }
    )

    this.startTimer();
  }

  //--------------------------------
  // Function to validate an account
  //--------------------------------
  validateCreateAccount() {
    console.log('account ' + this.user.firstName + ' created');
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  resetError() {
    this.error = false;
    this.otherError = false;
  }

  borrows: Borrow[] = new Array();

  //Cherche tous les emprunts en bd
  //et vérifie s'il y a des retards
  //Ensuite, affiche les retards avec un toast
  async alertLateness(user: User) {
    if (this.user) {
      await this.electrolibService.getBorrowsFromUser(user).subscribe(
        borrows => {
          this.borrows = borrows.map(x => (Object.assign(new Borrow(), x)));

          this.borrows.forEach(borrow => {
            if (borrow.calculateFee()! > 0 || borrow.calculateFee() != null) {
              console.log(borrow.calculateFee());

              if (borrow.transformTimeAndLate() == 1) {
                this.toastService.show('Votre emprunt (' + borrow.book.title + ') a ' + borrow.transformTimeAndLate() + ' journée de retard', {
                  classname: 'bg-danger',
                });
              }
              else if (borrow.transformTimeAndLate() > 1) {
                this.toastService.show('Votre emprunt (' + borrow.book.title + ') a ' + borrow.transformTimeAndLate() + ' jours de retard', {
                  classname: 'bg-danger',
                });
              }
              else if (borrow.transformTimeAndLate() == 0) {
                this.toastService.show('Votre emprunt (' + borrow.book.title + ') a 1 journée de retard', {
                  classname: 'bg-danger',
                });
              }
            }

            if (borrow.transformTimeAndLate() <= 7 && borrow.determineStatus() != 'En retard') {
              console.log(borrow.calculateFee());

              if (borrow.transformTimeAndLate() == 1 || borrow.transformTimeAndLate() == -1) {
                this.toastService.show('Il reste ' + borrow.transformTimeAndLate() + ' journée à votre emprunt (' + borrow.book.title + ')', {
                  classname: 'bg-warning',
                });
              }
              else {
                this.toastService.show('Il reste ' + borrow.transformTimeAndLate() + ' jours à votre emprunt (' + borrow.book.title + ')', {
                  classname: 'bg-warning',
                });
              }
            }
          });
        }
      );
    }
  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      this.startText = 'Stop';
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
      });
    } else {
      this.startText = 'Resume';
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.running = false;
    this.startText = 'Start';
    this.counter = undefined;
    clearInterval(this.timerRef);
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
  }
}
