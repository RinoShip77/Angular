import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../modele/User';
import { Genre } from '../modele/Genre';
import { Book } from '../modele/Book';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  visible = true;
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
  onInventory(user: User) {
    this.visible = true;
    this.user = user;
  }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    // TODO: Capitalize the first character on the server side
    //Get all the genres from the database
    this.electrolibSrv.getGenres().subscribe(
      genres => {
        this.genres = genres;
      }
    );

    //Get all the books from the database
    this.electrolibSrv.getBooks().subscribe(
      books => {
        this.books = books;
      }
    );
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
  applyFilter() {
    let filter: number[] = Array();
    
    for(let i=0; i<this.genres.length; i++)
    {
      if (this.genres[i].isFilter)
      {
        filter.push(this.genres[i].idGenre);
      }
    }

    console.log(filter);
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  displayBook(idBook: number) {
    //TODO: Try to figure out why the idBook start at 13, AND not 1
    this.openBook.emit(idBook - 12);
    this.visible = false;
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  onDisconnect(user: User) {
    this.visible = false;
  }
}
