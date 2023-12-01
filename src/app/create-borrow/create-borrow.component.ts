import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Borrow } from '../model/Borrow';
import { HttpResponse } from '@angular/common/http';
import { Book } from '../model/Book';
import { User } from '../model/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Reservation } from '../model/Reservation';

@Component({
  selector: 'app-create-borrow',
  templateUrl: './create-borrow.component.html',
  styleUrls: ['./create-borrow.component.css']
})
export class CreateBorrowComponent {

  books: Book[] = [];
  users: User[] = [];
  loading = false;
  availabilityDone = false;
  unavailableBooks: Book[] = [];
  reservationsToCancel: Reservation[] = [];


  bookError: Boolean = false;
  userError: Boolean = false;

  foundBooks: Book[] = [];
  foundUsers: User[] = [];

  selectedBooks: Book[] = [];
  selectedUser: User = new User();

  bookSearchField: string = "";
  userSearchField: string = "";

  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private router: Router, private dataService: DataService, private modalService: NgbModal) { }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveBooks();
    this.retrieveUsers();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifySelectedBook() {
    if (this.selectedBooks.length == 0) {
      this.bookError = true;
    }
    else {
      this.bookError = false;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifySelectedUser() {
    if (this.selectedUser.idUser == 0) {
      this.userError = true;
    }
    else {
      this.userError = false;
    }
  }

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  changeTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark');
      this.switchTheme.emit('dark');
    } else {
      localStorage.setItem('theme', 'light');
      this.switchTheme.emit('light');
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveBooks() {
    this.electrolibService.getAvailableBooks().subscribe(
      books => {
        this.books = books;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveUsers() {
    this.electrolibService.getUsers().subscribe(
      users => {
        this.users = users;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  removeSelectedBook(book: Book) {
    let index = this.selectedBooks.findIndex(b => b.idBook === book.idBook);
    if (index > -1) {
      this.selectedBooks.splice(index, 1);
    }
    this.verifySelectedBook();
    this.searchBooks();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  selectBook(book: Book) {
    this.selectedBooks.push(book);
    this.bookSearchField = "";
    this.searchBooks();
    this.verifySelectedBook();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  selectUser(user: User) {
    this.userSearchField = "";
    this.foundUsers = [];
    this.selectedUser = user;
    this.verifySelectedUser();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  searchBooks() {
    this.foundBooks = [];
    if (this.bookSearchField.length > 0) {
      this.books.forEach(book => {
        if (book.title.toUpperCase().includes(this.bookSearchField.toUpperCase()) && !this.selectedBooks.includes(book)) {
          this.foundBooks.push(book);
        }
      });
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  searchUsers() {
    this.foundUsers = [];
    if (this.userSearchField.length > 0) {
      this.users.forEach(user => {
        if (user.memberNumber.includes(this.userSearchField)) {
          this.foundUsers.push(user);
        }
      });
    }
  }

  //-------------------------------------------------------
  // Envoie les données du formulaire au serveur Symfony
  //-------------------------------------------------------
  onSubmit() {
    if (this.selectedBooks.length > 0 && this.selectedUser.idUser !== 0) {
      this.loading = true;

      // Crée un emprunt pour chaque livre
      const borrowObservables = this.selectedBooks.map(book =>
        this.electrolibService.createBorrow(this.selectedUser.idUser, book.idBook)
      );

      // Une fois tous les emprunts créés
      forkJoin(borrowObservables).subscribe(
        (responses) => {
          console.log('Borrow created successfully!', responses);

          if (this.reservationsToCancel.length > 0) {
            // Supprime les réservations faites sur chaque livre
            const cancelObservables = this.reservationsToCancel.map(reservation =>
              this.electrolibService.cancelReservation(reservation)
            );

            // Une fois les réservations supprimées
            forkJoin(cancelObservables).subscribe(
              (cancelResponses) => {
                console.log('Reservation(s) cancelled successfully!', cancelResponses);
                this.changeTab('borrows');
                this.router.navigate(['/adminBorrows']);
              },
              (cancelError) => {
                console.error('Cancellation failed:', cancelError);
              }
            );
          }
          else {
            this.changeTab('borrows');
            this.router.navigate(['/adminBorrows']);
          }

        },
        (error) => {
          console.error('Creation failed:', error);
        }
      );
    }
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
  openConfirmCreateBorrow(content: any) {
    this.verifySelectedBook();
    this.verifySelectedUser();

    this.unavailableBooks = [];
    this.reservationsToCancel = [];

    if (this.selectedUser.idUser != 0 && this.selectedBooks.length > 0) {
      this.resetWarnings()

      // Récupère les réservations en cours sur chaque livre
      const verificationObservables = this.selectedBooks.map(book =>
        this.electrolibService.getBookReservations(book.idBook)
      );

      // Une fois les réservations récupérées du serveur
      forkJoin(verificationObservables).subscribe(
        (responses) => {

          // Les réservations de chaque livre
          responses.forEach(reservations => {

            // Si le livre est réservé
            if (reservations.length > 0) {
              reservations.sort((a, b) => (a.reservationDate > b.reservationDate ? 1 : -1));

              // Si le premier livre de la liste est réservé par le membre sélectionné
              if (reservations[0].user.idUser === this.selectedUser.idUser) {
                this.reservationsToCancel.push(reservations[0]);
              }
              else {
                this.unavailableBooks.push(reservations[0].book);
                const book = this.selectedBooks.find(book => book.idBook === reservations[0].book.idBook);
                if (book) {
                  book.warning = true;
                }
              }
            }
          });

          // Ouvre la fenêtre modale de confirmation de l'emprunt si aucun conflit
          if (this.unavailableBooks.length == 0) {
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
          }
        },
        (error) => {
          console.error('Creation failed:', error);
        }
      );
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  resetWarnings() {
    this.selectedBooks.forEach( book => {
      book.warning = false;
    })
  }
}
