import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Book } from '../model/Book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})

export class AdminInventoryComponent {

  user: User = new User();
  books: Book[] = new Array();
  displayedBooks: Book[] = new Array();
  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";

  constructor(private electrolibSrv: ElectrolibService, private router: Router) { }

  ngOnInit() {
    this.retrieveBooks();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createBook() {
    this.router.navigate(["/createBook"]);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  editBook(idBook: number) {
    this.router.navigate(['/editBook', idBook]);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeResearchBy(type: String) {
    this.selectedSearchBy = type;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeSortBy(type: String) {
    this.selectedSortBy = type;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  sortBooks() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBooks.sort((a, b) => (a.title > b.title ? 1 : -1));
          break;
        case "isbn":
          this.displayedBooks.sort((a, b) => (a.isbn > b.isbn ? 1 : -1));
          break;
        case "author":
          this.displayedBooks.sort((a, b) => (a.author > b.author ? 1 : -1));
          break;
      }
    } 
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBooks.sort((a, b) => (a.title < b.title ? 1 : -1));
          break;
        case "isbn":
          this.displayedBooks.sort((a, b) => (a.isbn < b.isbn ? 1 : -1));
          break;
        case "author":
          this.displayedBooks.sort((a, b) => (a.author < b.author ? 1 : -1));
          break;
      }
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  search() {
    if (this.searchField.trim().length > 0) {
      this.displayedBooks = [];
      this.books.forEach(book => {
        switch (this.selectedSearchBy) {
          case "title":
            if (book.title.includes(this.searchField)) {
              this.displayedBooks.push(book);
            }
            break;
          case "isbn":
            if (book.isbn.includes(this.searchField)) {
              this.displayedBooks.push(book);
            }
            break;
          case "author":
            if (book.author.firstName.includes(this.searchField)) {
              this.displayedBooks.push(book);
            }
            break;
        }
      });
    } else {
      this.displayedBooks = this.books;
    }
    this.sortBooks();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveBooks(filter?: number[]) {
    // this.electrolibSrv.getBooks(filter).subscribe(
    //   books => {
    //     this.books = books;
    //     this.displayedBooks =  books;
    //   }
    // );
  }
}
