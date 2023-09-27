import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Book } from '../model/Book';

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

  @Output() addSearchCriteria = new EventEmitter<string>();

  constructor(private electrolibSrv: ElectrolibService) { }

  ngOnInit() {
    this.retrieveBooks();
  }

  //-------------------------------------------------------
  // Change le type de recherche
  //-------------------------------------------------------
  changeResearchBy(type: String) {
    this.selectedSearchBy = type;
  }

  //-------------------------------------------------------
  // Change l'ordre de tri
  //-------------------------------------------------------
  changeSortBy(type: String) {
    this.selectedSortBy = type;
  }

  //-------------------------------------------------------
  // Tri les livres
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
  // Recherche par nom de livre
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
  // Récupère tous les livres présents en base de données
  //-------------------------------------------------------
  retrieveBooks(filter?: number[]) {
    this.electrolibSrv.getBooks(filter).subscribe(
      books => {
        this.books = books;
        this.displayedBooks =  books;
      }
    );
  }

  //-------------------------------------------------------
  // Affiche l'inventaire admin
  //-------------------------------------------------------
  onAdminInventory(user: User) {
    //this.visible = true;
    this.user = user;
  }

  //-------------------------------------------------------
  // Déconnecte l'admin
  //-------------------------------------------------------
  onDisconnect(user: User) {
    //fesait visible, on garde la fcnt au cas ou
  }
}
