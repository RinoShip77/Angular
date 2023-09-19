import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Genre } from '../model/Genre';
import { Book } from '../model/Book';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  visible = false;
  user: User = new User();
  genres: Genre[] = new Array();
  books: Book[] = new Array();

  @Output() openProfile = new EventEmitter<User>();
  @Output() openBook = new EventEmitter<Number>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolibSrv: ElectrolibService) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    //Get all the genres from the database
    this.retrieveGenres();

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
  // Function to get all the books from the database
  //---------------------------------
  retrieveBooks(filter?: number[], search?: string) {
    this.electrolibSrv.getBooks(filter, search).subscribe(
      books => {
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
  // Function to select witch genre you want to see
  //---------------------------------
  updateFilter(idGenre: number) {
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].idGenre == idGenre) {
        this.genres[i].isFilter = !this.genres[i].isFilter;
      }
    }
  }

  //---------------------------------
  // Function to filter the library
  //---------------------------------
  applyFilters(search?: string) {
    let filters: number[] = Array();

    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].isFilter) {
        filters.push(this.genres[i].idGenre);
      }
    }

    this.retrieveBooks(filters, search);
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
  displayBook(idBook: number) {
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