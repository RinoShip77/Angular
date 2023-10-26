import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Borrow } from '../model/Borrow';
import { HttpResponse } from '@angular/common/http';
import { Book } from '../model/Book';
import { User } from '../model/User';

@Component({
  selector: 'app-create-borrow',
  templateUrl: './create-borrow.component.html',
  styleUrls: ['./create-borrow.component.css']
})
export class CreateBorrowComponent {

  books: Book[] = [];
  users: User[] = [];

  foundBooks: Book[] = [];
  foundUsers: User[] = [];

  selectedBook: Book = new Book();
  selectedUser: User = new User();

  bookSearchField: string = "";
  userSearchField: string = "";

  constructor(private electrolibService: ElectrolibService, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.retrieveBooks();
    this.retrieveUsers();
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

  selectBook(book: Book) {
    this.bookSearchField = "";
    this.foundBooks = [];
    this.selectedBook = book;
  }

  selectUser(user: User) {
    this.userSearchField = "";
    this.foundUsers = [];
    this.selectedUser = user;
  }

  searchBooks() {
    this.foundBooks = [];
    if (this.bookSearchField.length > 0) {
      this.books.forEach(book => {
        if (book.title.toUpperCase().includes(this.bookSearchField.toUpperCase())) {
          this.foundBooks.push(book);
        }
      });
    }
  }

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
    this.electrolibService.createBorrow(this.selectedUser.idUser, this.selectedBook.idBook).subscribe(
      (response) => {
          console.log('Borrow created successfully!', response);
          this.changeTab('borrows');
          this.router.navigate(["/adminBorrows"]);
      },
      (error) => {
        console.error('Creation failed:', error);
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }

}
