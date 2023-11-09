import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Genre } from '../model/Genre';
import { Book } from '../model/Book';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Author } from '../model/Author';
import { Router } from '@angular/router';
import { getURLBookCover } from '../util';
import { Status } from '../model/Status';
import { Favorite } from '../model/Favorite';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  user: User = new User();
  genres: Genre[] = new Array();
  authors: Author[] = new Array();
  status: Status[] = new Array();
  favorites: Favorite[] = new Array();
  books: Book[] = new Array();
  displayedBooks: Book[] = new Array();
  previousBooks: Book[] = new Array();
  loading: boolean = true;
  inventoryDisplay: string = 'table';
  searchInp = '';
  sortOrder: string = 'ascending';
  sortProperty: string = 'date';

  //---------------------------------
  // Function to build the component
  //---------------------------------
  constructor(private electrolibSrv: ElectrolibService, private modalService: NgbModal, private router: Router) { }

  //---------------------------------
  // Function to initialize the component
  //---------------------------------
  ngOnInit() {
    //Get all the genres
    this.retrieveGenres();
    
    //Get all the authors
    this.retrieveAuthors();
    
    //Get all the statuses
    this.retrieveStatus();
    
    //Get all the favorites
    this.retrieveFavorites();
    
    //Get all the books
    this.retrieveBooks();
  }
  
  //---------------------------------
  // Function to retrieve the genres from the database
  //---------------------------------
  retrieveGenres() {
    this.electrolibSrv.getGenres().subscribe(
      genres => {
        this.genres = genres;
      }
    );
  }

  //---------------------------------
  // Function to retrieve the authors from the database
  //---------------------------------
  retrieveAuthors() {
    this.electrolibSrv.getAuthors().subscribe(
      authors => {
        this.authors = authors;
      }
    );
  }

  //---------------------------------
  // Function to retrieve the statuses from the database
  //---------------------------------
  retrieveStatus() {
    this.electrolibSrv.getAllStatus().subscribe(
      status => {
        this.status = status;
      }
    );
  }

  //---------------------------------
  // Function to retrieve the favorites from the database
  //---------------------------------
  retrieveFavorites() {
    this.electrolibSrv.getFavorites().subscribe(
      favorites => {
        this.favorites = favorites;
      }
    );
  }

  //---------------------------------
  // Function to retrieve the books from the database
  //---------------------------------
  retrieveBooks() {
    this.electrolibSrv.getBooks().subscribe(
      books => {
        setTimeout(() => {
          this.loading = false;
          this.books = books;
          this.displayedBooks = books;
        }, 1000);
      }
    );
  }

  //---------------------------------
  // Function to sort the books
  //---------------------------------
  sortInventory() {
    switch (this.sortProperty) {
      case 'date':
        if (this.sortOrder === 'descending') {
          this.displayedBooks.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (a.publishedDate > b.publishedDate ? 1 : -1));
        }
        break;
      case 'title':
        if (this.sortOrder === 'descending') {
          this.displayedBooks.sort((a, b) => (a.title < b.title ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (a.title > b.title ? 1 : -1));
        }
        break;
      case 'author':
        if (this.sortOrder === 'descending') {
          this.displayedBooks.sort((a, b) => (a.author.lastName < b.author.lastName ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (a.author.lastName > b.author.lastName ? 1 : -1));
        }
        break;
    }
  }

  //---------------------------------
  // Function to filter the books by a research
  //---------------------------------
  applySearch(search: string, reset: boolean) {
    if (reset) {
      this.displayedBooks = this.books;
    }

    this.displayedBooks = this.displayedBooks.filter((book) => book.title.toLowerCase().includes(search));
  }

  //---------------------------------
  // Function to add dynamic response to the search bar
  //---------------------------------
  onKeyup(event: KeyboardEvent) {
    if (event.keyCode == 8) {
      this.applySearch(this.searchInp, true);
    }
  }

  //---------------------------------
  // Function to filter the books by the criteria given
  //---------------------------------
  filterBooks(filter: string, id: number, isFilter: boolean) {
    if (!isFilter || isFilter == undefined) {
      let nbFilter = 1;

      switch (filter) {
        case 'genre':
          for (let i = 0; i < this.genres.length; i++) {
            if (this.genres[i].isFilter || this.genres[i].isFilter != undefined) {
              nbFilter++;
            }
          }

          if (nbFilter == 1) {
            this.previousBooks = this.books.filter((book) => book.genre.idGenre === id);
          }

          this.displayedBooks = this.books.filter((book) => book.genre.idGenre === id);
          this.displayedBooks = this.displayedBooks.concat(this.previousBooks);
          break;

        case 'author':
          for (let i = 0; i < this.genres.length; i++) {
            if (this.genres[i].isFilter || this.genres[i].isFilter != undefined) {
              nbFilter++;
            }
          }

          if (nbFilter == 1) {
            this.previousBooks = this.books.filter((book) => book.genre.idGenre === id);
          }

          this.displayedBooks = this.books.filter((book) => book.author.idAuthor === id);
          this.displayedBooks = this.displayedBooks.concat(this.previousBooks);
          break;

        case 'status':
          for (let i = 0; i < this.genres.length; i++) {
            if (this.genres[i].isFilter || this.genres[i].isFilter != undefined) {
              nbFilter++;
            }
          }

          if (nbFilter == 1) {
            this.previousBooks = this.books.filter((book) => book.genre.idGenre === id);
          }

          this.displayedBooks = this.books.filter((book) => book.status.idStatus === id);
          this.displayedBooks = this.displayedBooks.concat(this.previousBooks);
          break;
      }
    }
  }

  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  removeFilters() {
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].isFilter) {
        this.genres[i].isFilter = false;
      }
    }

    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].isFilter) {
        this.authors[i].isFilter = false;
      }
    }

    for (let i = 0; i < this.status.length; i++) {
      if (this.status[i].isFilter) {
        this.status[i].isFilter = false;
      }
    }

    this.retrieveBooks();
  }

  //---------------------------------
  // Open a modal with the given content
  //---------------------------------
  openModal(content: any, size: string) {
    this.modalService.open(content, {
      animation: true,
      centered: true,
      keyboard: true,
      size: size
    });
  }

  //---------------------------------
  // Function to change the way to display the books
  //---------------------------------
  updateDisplay(status: Status) {
    switch (status.status) {
      case 'Disponible':
        return 'table-primary';
        break;

      case 'Emprunté':
        return 'table-light';
        break;

      case 'Réservé':
        return 'table-warning';
        break;

      case 'Perdu':
        return 'opacity-25';
        break;

      case 'Supprimé':
        return 'table-danger';
        break;

      default:
        return '';
        break;
    }
  }

  //---------------------------------
  // Function to mark the book as favorite
  //---------------------------------
  isFavorite(idBook: number) {
    for (let index = 0; index < this.favorites.length; index++) {
      if (this.favorites[index].book.idBook === idBook) {
        return true;
      }
    }

    return false;
  }

  //---------------------------------
  // Function to retrieve the image of a book
  //---------------------------------
  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }
}