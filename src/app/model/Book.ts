import { Genre } from "./Genre";
import { Author } from "./Author";

export class Book {
  idBook: number = 0;
  idGenre: number = 0;
  genre: Genre = new Genre();
  idAuthor: number = 0;
  author: Author = new Author();
  title: string = '';
  description: string = '';
  isbn: string = '';
  idBorrowed: number = 0;
 // borrow: Borrow = new Borrow();
  isBorrowed: boolean = false;
  cover: string = '';
  publishedDate: Date = new Date();
  originalLanguage: string = '';
 // evaluations: Evaluation[] = new Array();
 isFavorite: boolean = false;
 // favorites: Favorite[] = new Array();
  //reservations: Reservation[] = new Array();
}