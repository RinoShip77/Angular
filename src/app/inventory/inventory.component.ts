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
  books: Book[] = new Array();
  inventoryDisplay: string = 'table';
  sortOrder: string = 'date;DESC';
  searchInp = '';

  @Output() openProfile = new EventEmitter<User>();
  @Output() openBook = new EventEmitter<Number>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolibSrv: ElectrolibService, private modalService: NgbModal, private router: Router) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    //Get all the genres from the database
    this.retrieveGenres();

    //Get all the authors from the database
    this.retrieveAuthors();
    
    //Get all the status from the database
    this.retrieveStatus();

    //Get all the books from the database
    this.retrieveBooks();
  }

  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  retrieveGenres() {
    this.electrolibSrv.getGenres().subscribe(
      genres => {
        this.genres = genres;
      }
    );
  }

  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  retrieveAuthors() {
    this.electrolibSrv.getAuthors().subscribe(
      authors => {
        this.authors = authors;
      }
    );
  }
  
  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  retrieveStatus() {
    this.electrolibSrv.getAllStatus().subscribe(
      status => {
        this.status = status;
      }
    );
  }

  //---------------------------------
  // Function to get all the books from the database
  //---------------------------------
  retrieveBooks() {
    this.electrolibSrv.getBooks().subscribe(
      books => {
        this.books = books;
      }
    );
  }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onInventory(user: User) {
    //this.visible = true;
    this.user = user;
  }

  //---------------------------------
  // Open the modal to update the user password
  //---------------------------------
  openModal(content: any) {
    this.modalService.open(content, {
      animation: true,
      centered: true,
      keyboard: true,
      size: 'lg'
    });
  }

  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  sortInventory() {
    let property = this.sortOrder.split(';')[0];
    let order = this.sortOrder.split(';')[1];

    switch (property) {
      case 'date':
        if (order === 'DESC') {
          this.books.sort((a, b) => (a.publishedDate > b.publishedDate ? 1 : -1));
        } else {
          this.books.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
        }
        break;
      case 'title':
        if (order === 'DESC') {
          this.books.sort((a, b) => (a.title > b.title ? 1 : -1));
        } else {
          this.books.sort((a, b) => (a.title < b.title ? 1 : -1));
        }
        break;
        case 'author':
          if (order === 'DESC') {
            this.books.sort((a, b) => (a.author.lastName > b.author.lastName ? 1 : -1));
          } else {
          this.books.sort((a, b) => (a.author.lastName < b.author.lastName ? 1 : -1));
        }
        break;
    }
  }

  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  applySearch(search: string) {
    this.books = this.books.filter((book) => book.title.includes(search));
  }

  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  filterBooksByGenres(idGenre: number) {
    this.books = this.books.filter((book) => book.genre.idGenre === idGenre);
  }

  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  filterBooksByAuthors(idAuthor: number) {
    this.books = this.books.filter((book) => book.author.idAuthor === idAuthor);
  }
  
  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  filterBooksByStatus(idStatus: number) {
    this.books = this.books.filter((book) => book.status.idStatus === idStatus);
  }

  //---------------------------------
  // Function to remove all the filters from the view
  //---------------------------------
  removeFilters() {
    // for (let i = 0; i < this.genres.length; i++) {
    //   if (this.genres[i].isFilter) {
    //     this.genres[i].isFilter = false;
    //   }
    // }

    // for (let i = 0; i < this.authors.length; i++) {
    //   if (this.authors[i].isFilter) {
    //     this.authors[i].isFilter = false;
    //   }
    // }
    
    // for (let i = 0; i < this.status.length; i++) {
    //   if (this.status[i].isFilter) {
    //     this.status[i].isFilter = false;
    //   }
    // }

    this.retrieveBooks();
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  updateDisplay(status: Status): string {
    if (status.status == 'Disponible') {
      return 'table-primary';
    } else {
      return 'opacity-25';
    }
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  addFavorite(idBook: number) {
    console.log(idBook)
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/books/default-book.png';
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  onDisconnect(user: User) {
    //cette fnct fesait visible.false, on grade la fcnt au cas ou
  }

  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }
}