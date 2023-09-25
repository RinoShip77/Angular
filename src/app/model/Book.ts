import { Genre } from "./Genre";
import { Author } from "./Author";
export class Book {
  idBook: number = 0;
  idGenre: number = 0;
  idAuthor: number = 0;
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
 // favorites: Favorite[] = new Array();
  //reservations: Reservation[] = new Array();
}