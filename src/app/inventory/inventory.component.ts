import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Genre } from '../model/Genre';
import { Book } from '../model/Book';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Author } from '../model/Author';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  visible = false;
  user: User = new User();
  genres: Genre[] = new Array();
  authors: Author[] = new Array();
  books: Book[] = new Array();
  inventoryDisplay: string = 'table';
  sortOrder: string = 'date;DESC';

  @Output() openProfile = new EventEmitter<User>();
  @Output() openBook = new EventEmitter<Number>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolibSrv: ElectrolibService, private modalService: NgbModal) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    //Get all the genres from the database
    this.retrieveGenres();

    //Get all the genres from the database
    this.retrieveAuthors();

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
  // Function to get all the books from the database
  //---------------------------------
  retrieveBooks(genresFilter?: number[], authorsFilter?: number[], search?: string) {
    this.electrolibSrv.getBooks(genresFilter, authorsFilter, search).subscribe(
      books => {
        books.forEach(book => {
          this.electrolibSrv.getGenre(book.idGenre).subscribe(
            genre => {
              book.genre = genre;
            }
          )
          this.electrolibSrv.getAuthor(book.idAuthor).subscribe(
            author => {
              book.author = author;
            }
          )
        });
        this.books = books;
      }
    );
  }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onInventory(user: User) {
    this.visible = true;
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
          this.books.sort(this.compareDateDesc);
        } else {
          this.books.sort(this.compareDateAsc);
        }
        break;
      case 'title':
        if (order === 'DESC') {
          this.books.sort(this.compareTitleDesc);
        } else {
          this.books.sort(this.compareTitleAsc);
        }
        break;
      case 'author':
        if (order === 'DESC') {
          this.books.sort(this.compareAuthorDesc);
        } else {
          this.books.sort(this.compareAuthorAsc);
        }
        break;
    }
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareDateDesc(book1: Book, book2: Book) {
    if (book1.publishedDate > book2.publishedDate) {
      return -1;
    }
    if (book1.publishedDate < book2.publishedDate) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareDateAsc(book1: Book, book2: Book) {
    if (book1.publishedDate < book2.publishedDate) {
      return -1;
    }
    if (book1.publishedDate > book2.publishedDate) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareTitleDesc(book1: Book, book2: Book) {
    if (book1.title > book2.title) {
      return -1;
    }
    if (book1.title < book2.title) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareTitleAsc(book1: Book, book2: Book) {
    if (book1.title < book2.title) {
      return -1;
    }
    if (book1.title > book2.title) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareAuthorDesc(book1: Book, book2: Book) {
    if (book1.idAuthor > book2.idAuthor) {
      return -1;
    }
    if (book1.idAuthor < book2.idAuthor) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to sort by date descending
  //---------------------------------
  compareAuthorAsc(book1: Book, book2: Book) {
    if (book1.idAuthor < book2.idAuthor) {
      return -1;
    }
    if (book1.idAuthor > book2.idAuthor) {
      return 1;
    }

    return 0;
  }

  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  updateGenresFilter(idGenre: number) {
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].idGenre == idGenre) {
        this.genres[i].isFilter = !this.genres[i].isFilter;
      }
    }

    this.applyFilters();
  }

  //---------------------------------
  // Function to select witch genre you want to see
  //---------------------------------
  updateAuthorsFilter(idAuthor: number) {
    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].idAuthor == idAuthor) {
        this.authors[i].isFilter = !this.authors[i].isFilter;
      }
    }

    this.applyFilters();
  }

  //---------------------------------
  // Function to filter the library
  //---------------------------------
  applyFilters(search?: string) {
    let genresFilter: number[] = Array();
    let authorsFilter: number[] = Array();

    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].isFilter) {
        genresFilter.push(this.genres[i].idGenre);
      }
    }

    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].isFilter) {
        authorsFilter.push(this.authors[i].idAuthor);
      }
    }

    this.retrieveBooks(genresFilter, authorsFilter, search);
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

    this.retrieveBooks();
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  updateDisplay(isBorrowed?: boolean): string {
    if (!isBorrowed) {
      return 'table-primary';
    } else {
      return 'opacity-25';
    }
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  displayBook(idBook: number) {
    console.log(idBook)
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
    this.visible = false;
  }
}