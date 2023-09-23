import { Genre } from "./Genre";
import { Author } from "./Author";

export class Book {
  idBook: number = 0;
  genre: Genre = new Genre();
  author: Author = new Author();
  title: string = '';
  description: string = '';
  isbn: string = '';
  isBorrowed: boolean = false;
  cover: string = '';
  publishedDate: Date = new Date();
  originalLanguage: string = '';
}