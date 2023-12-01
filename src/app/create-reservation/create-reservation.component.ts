import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../model/Book';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css']
})
export class CreateReservationComponent {
  books: Book[] = [];
  users: User[] = [];
  loading = false;

  foundBooks: Book[] = [];
  foundUsers: User[] = [];

  bookError: Boolean = false;
  userError: Boolean = false;

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
    this.electrolibService.getBooks().subscribe(
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
    this.searchBooks();
    this.verifySelectedBook();
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
      const reservationObservables = this.selectedBooks.map(book =>
        this.electrolibService.createReservation(this.selectedUser.idUser, book.idBook)
      );
  
      forkJoin(reservationObservables).subscribe(
        (responses) => {
          console.log('Reservation created successfully', responses);
          this.changeTab('reservations');
          this.router.navigate(["/adminReservations"]);
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

    if (this.selectedUser.idUser != 0 && this.selectedBooks.length > 0) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
    }
  }

}