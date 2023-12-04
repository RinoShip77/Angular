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
import { DataService } from '../data.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  user: User | undefined = new User();
  loading: boolean = true;
  books: Book[] = new Array();
  displayedBooks: Book[] = new Array();
  genres: Genre[] = new Array();
  authors: Author[] = new Array();
  statuses: Status[] = new Array();
  favorites: Favorite[] = new Array();
  favoriteFilter: boolean = false;
  notFavoriteFilter: boolean = false;
  searchInp = '';
  sortOrder: string = 'ascending';
  sortProperty: string = 'date';
  inventoryDisplay: string = 'table';
  numberOfLike: number[] = new Array();
  numberOfBooksByGenres: number[] = new Array();
  numberOfBooksByAuthors: number[] = new Array();
  numberOfBooksByStatus: number[] = new Array();

  //---------------------------------
  // Function to build the component
  //---------------------------------
  constructor(private electrolibSrv: ElectrolibService, private modalService: NgbModal, private router: Router, private dataService: DataService) { }

  //---------------------------------
  // Function to initialize the component
  //---------------------------------
  ngOnInit() {
    if (this.dataService.getUser() != undefined) {
      this.user = this.dataService.getUser();
    }

    this.retrieveGenres();
    this.retrieveAuthors();
    this.retrieveStatus();
    this.retrieveFavorites();
    this.retrieveBooks(true);
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
      statuses => {
        this.statuses = statuses;
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
  retrieveBooks(loadingSVG?: boolean) {
    this.electrolibSrv.getBooks().subscribe(
      books => {
        if (loadingSVG) {
          this.books = books;
          this.displayedBooks = books;
          setTimeout(() => { this.loading = false; }, 1000);
        } else {
          this.books = books;
          this.displayedBooks = books;
        }
      }
    );
  }

  //---------------------------------
  // Function to get the number of books
  //---------------------------------
  getNumberOfBooks(filter: string, id?: number) {
    switch (filter) {
      case 'genre':
        return this.books.filter((book) => book.genre.idGenre === id).length
        break;

      case 'author':
        return this.books.filter((book) => book.author.idAuthor === id).length
        break;

      case 'status':
        return this.books.filter((book) => book.status.idStatus == id).length
        break;

      case 'favorite':
        return this.favorites.length;
        break;

      case 'notFavorite':
        return this.favorites.length;
        break;
    }

    return 0;
  }

  //---------------------------------
  // Function to get the number of favorites
  //---------------------------------
  getNumberOfFavorites(idBook: number) {
    return this.favorites.filter((favorite) => favorite.book.idBook === idBook).length
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
          this.displayedBooks.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
        }
        break;

      case 'author':
        if (this.sortOrder === 'descending') {
          this.displayedBooks.sort((a, b) => (a.author.lastName.toLowerCase() < b.author.lastName.toLowerCase() ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (a.author.lastName.toLowerCase() > b.author.lastName.toLowerCase() ? 1 : -1));
        }
        break;

      case 'favorite':
        if (this.sortOrder === 'descending') {
          this.displayedBooks.sort((a, b) => (this.getNumberOfFavorites(a.idBook) < this.getNumberOfFavorites(b.idBook) ? 1 : -1));
        } else {
          this.displayedBooks.sort((a, b) => (this.getNumberOfFavorites(a.idBook) > this.getNumberOfFavorites(b.idBook) ? 1 : -1));
        }
        break;
    }
  }

  //---------------------------------
  // Function to filter the books by a research
  //---------------------------------
  applySearch(search: string, reset?: boolean) {
    if (search.length !== 0) {
      if (reset) {
        this.displayedBooks = this.books;
      }

      this.displayedBooks = this.displayedBooks.filter((book) => book.title.toLowerCase().includes(search));
    } else {
      this.displayedBooks = this.books;
    }
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
  filterBooks(filter: string, id?: number, isFilter?: boolean) {
    switch (filter) {
      case 'genre':
        if (!isFilter) {
          if (this.genres.filter((genre) => genre.isFilter === true).length >= 1) {
            this.displayedBooks = this.displayedBooks.concat(this.books.filter((book) => book.genre.idGenre === id));
          } else {
            this.displayedBooks = this.displayedBooks.filter((book) => book.genre.idGenre === id);
          }
        } else {
          this.displayedBooks = this.displayedBooks.filter((book) => !(book.genre.idGenre === id));

          if (this.authors.filter((author) => author.isFilter === true).length >= 1) {
            this.authors.filter((author) => author.isFilter === true).forEach(author => {
              if (author.isFilter) {
                this.filterBooks('author', author.idAuthor);
              }
            });
          }

          if (this.statuses.filter((status) => status.isFilter === true).length >= 1) {
            this.statuses.filter((status) => status.isFilter === true).forEach(status => {
              if (status.isFilter) {
                this.filterBooks('status', status.idStatus);
              }
            });
          }
        }
        break;

      case 'author':
        if (!isFilter) {
          if (this.authors.filter((author) => author.isFilter === true).length >= 1) {
            this.displayedBooks = this.displayedBooks.concat(this.books.filter((book) => book.author.idAuthor === id));
          } else {
            this.displayedBooks = this.displayedBooks.filter((book) => book.author.idAuthor === id);
          }
        } else {
          this.displayedBooks = this.displayedBooks.filter((book) => !(book.author.idAuthor === id));

          if (this.genres.filter((genre) => genre.isFilter === true).length >= 1) {
            this.genres.filter((genre) => genre.isFilter === true).forEach(genre => {
              if (genre.isFilter) {
                this.filterBooks('genre', genre.idGenre);
              }
            });
          }

          if (this.statuses.filter((status) => status.isFilter === true).length >= 1) {
            this.statuses.filter((status) => status.isFilter === true).forEach(status => {
              if (status.isFilter) {
                this.filterBooks('status', status.idStatus);
              }
            });
          }
        }
        break;

      case 'status':
        if (!isFilter) {
          if (this.statuses.filter((status) => status.isFilter === true).length >= 1) {
            this.displayedBooks = this.displayedBooks.concat(this.books.filter((book) => book.status.idStatus === id));
          } else {
            this.displayedBooks = this.displayedBooks.filter((book) => book.status.idStatus === id);
          }
        } else {
          this.displayedBooks = this.displayedBooks.filter((book) => !(book.status.idStatus === id));

          if (this.genres.filter((genre) => genre.isFilter === true).length >= 1) {
            this.genres.filter((genre) => genre.isFilter === true).forEach(genre => {
              if (genre.isFilter) {
                this.filterBooks('genre', genre.idGenre);
              }
            });
          }

          if (this.authors.filter((author) => author.isFilter === true).length >= 1) {
            this.authors.filter((author) => author.isFilter === true).forEach(author => {
              if (author.isFilter) {
                this.filterBooks('author', author.idAuthor);
              }
            });
          }
        }
        break;

      case 'favorite':
        if (!this.favoriteFilter) {
          let tmp = new Array();

          for (let index = 0; index < this.displayedBooks.length; index++) {
            if (this.isFavorite(this.displayedBooks[index].idBook)) {
              tmp.push(this.displayedBooks[index]);
            }
          }

          this.displayedBooks = tmp;
        } else {
          this.displayedBooks = this.books;
        }
        break;
    }

    if ((
      (this.genres.filter((genre) => genre.isFilter === true).length === 1 && this.authors.filter((author) => author.isFilter === true).length === 0 && this.statuses.filter((status) => status.isFilter === true).length === 0) ||
      (this.genres.filter((genre) => genre.isFilter === true).length === 0 && this.authors.filter((author) => author.isFilter === true).length === 1 && this.statuses.filter((status) => status.isFilter === true).length === 0) ||
      (this.genres.filter((genre) => genre.isFilter === true).length === 0 && this.authors.filter((author) => author.isFilter === true).length === 0 && this.statuses.filter((status) => status.isFilter === true).length === 1)) && this.displayedBooks.length === 0) {
      this.displayedBooks = this.books;
    }

    this.sortInventory();
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

    for (let i = 0; i < this.statuses.length; i++) {
      if (this.statuses[i].isFilter) {
        this.statuses[i].isFilter = false;
      }
    }

    this.favoriteFilter = false;
    this.displayedBooks = this.books;
    this.sortInventory();
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
  // Function to check if a book is favorite
  //---------------------------------
  isFavorite(idBook: number) {
    for (let index = 0; index < this.favorites.length; index++) {
      if (this.favorites[index].user.idUser === this.user?.idUser && this.favorites[index].book.idBook === idBook) {
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