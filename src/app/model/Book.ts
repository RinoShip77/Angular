import { Genre } from "./Genre";
import { Author } from "./Author";
import { Borrow } from "./Borrow";
import { Evaluation } from "./Evaluation";
import { Favorite } from "./Favorite";
import { Reservation } from "./Reservation";

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
  borrow: Borrow = new Borrow();
  isBorrowed: boolean = false;
  cover: string = '';
  publishedDate: Date = new Date();
  originalLanguage: string = '';
  evaluations: Evaluation[] = new Array();
  favorites: Favorite[] = new Array();
  reservations: Reservation[] = new Array();
}