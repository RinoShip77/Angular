import { Genre } from "./Genre";
import { Author } from "./Author";
import { Borrow } from "./Borrow";
import { Evaluation } from "./Evaluation";
import { Favorite } from "./Favorite";
import { Reservation } from "./Reservation";
import { Status } from "./Status";

export class Book {
  idBook: number = 0;
  idGenre: number = 0;
  genre: Genre = new Genre();
  idAuthor: number = 0;
  author: Author = new Author();
  title: string = '';
  description: string = '';
  isbn: string = '';
  // borrow: Borrow = new Borrow();
  // isBorrowed: boolean = false;
  cover: string = "/";
  publishedDate: string = '';
  originalLanguage: string = '';
  // evaluations: Evaluation[] = new Array();
  isFavorite: boolean = false;
  // favorites: Favorite[] = new Array();
  // reservations: Reservation[] = new Array();
  idStatus: number = 1;
  status: Status = new Status();
  isRecommended: Boolean = false;
  addedDate: string = '';

  // Nécessaire pour les messages d'erreur
  warning: boolean = false;

  formatedPublishedDate()
  {
    return this.publishedDate.split(" ")[0];
  }
}