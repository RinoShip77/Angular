import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';

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
  book: Book = new Book();
  desc: boolean = true;
  genres: Genre[] = [];

  isChecked = false;
  colorSwitch: boolean = false;
  loaded = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private dataService: DataService, private modalService: NgbModal) { }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveBooks();
    this.retrieveGenres();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifyIfResultFound() {
    if (this.displayedBooks.length == 0 && this.loaded) {
      return true;
    }
    return false;
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
  //
  //-------------------------------------------------------
  sortColumnBy(sortBy: string) {
    this.selectedSearchBy = sortBy;
    if (this.desc) {
      this.desc = false;
      this.selectedSortBy = "descending";
    }
    else {
      this.desc = true;
      this.selectedSortBy = "ascending";
    }
      
    this.sortBooks();
  }

  //-------------------------------------------------------
  // Tri les livres
  //-------------------------------------------------------
  sortBooks() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBooks.sort((a, b) => (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1));
          break;
        case "isbn":
          this.displayedBooks.sort((a, b) => (a.isbn > b.isbn ? 1 : -1));
          break;
        case "author":
          this.displayedBooks.sort((a, b) => (a.author.lastName.toUpperCase() > b.author.lastName.toUpperCase() ? 1 : -1));
          break;
        case "status":
          this.displayedBooks.sort((a, b) => (a.status.status.toUpperCase() > b.status.status.toUpperCase() ? 1 : -1));
          break;
        case "addedDate":
          this.displayedBooks.sort((a, b) => (a.addedDate > b.addedDate ? 1 : -1));
           break;
      }
    } 
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBooks.sort((a, b) => (a.title.toUpperCase() < b.title.toUpperCase() ? 1 : -1));
          break;
        case "isbn":
          this.displayedBooks.sort((a, b) => (a.isbn < b.isbn ? 1 : -1));
          break;
        case "author":
          this.displayedBooks.sort((a, b) => (a.author.lastName.toUpperCase() < b.author.lastName.toUpperCase() ? 1 : -1));
          break;
        case "status":
          this.displayedBooks.sort((a, b) => (a.status.status.toUpperCase() < b.status.status.toUpperCase() ? 1 : -1));
           break;
        case "addedDate":
          this.displayedBooks.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1));
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
          
          case "isbn":
            if (book.isbn.toUpperCase().includes(this.searchField.toUpperCase())) {
              this.displayedBooks.push(book);
            }
            break;
          case "author":
            if (book.author.firstName.toUpperCase().includes(this.searchField.toUpperCase()) || 
                book.author.lastName.toUpperCase().includes(this.searchField.toUpperCase())) {
              this.displayedBooks.push(book);
            }
            break;
          default:
            if (book.title.toUpperCase().includes(this.searchField.toUpperCase())) {
              this.displayedBooks.push(book);
            }
            break;
        }
      });
    } else {
      this.displayedBooks = this.books;
    }
    this.showBooksCriteria();
    this.sortBooks();
  }

  //-------------------------------------------------------
  // Récupère tous les livres présents en base de données
  //-------------------------------------------------------
  retrieveBooks(filter?: number[]) {
     this.electrolibService.getBooks().subscribe(
       books => {
         this.books = books;
         this.displayedBooks = books;
         this.loaded = true;
       }
     );
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
  isValidDate(date: any): boolean {
    return date !== '0000-00-00 00:00:00';
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openAbout(content: any, idBook: number) 
  {
    this.book = new Book();
    this.electrolibService.getBook(idBook).subscribe(
      book => {
        this.book = book;
      }
    );

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true});
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.search();
    this.showBooksCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  showBooksCriteria() {
    let tempBooks: Book[] = [];

    if (this.isChecked) {

      this.displayedBooks.forEach(b => {
        if (b.isRecommended) {
          tempBooks.push(b);
        }
      });
      this.displayedBooks = tempBooks;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveGenres() {
    this.electrolibService.getGenres().subscribe(
      genres => {
        this.genres = genres;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getGenre(idGenre: number) {
    const genre = this.genres.find(genre => genre.idGenre === idGenre);
    return genre?.name;
  }
}
