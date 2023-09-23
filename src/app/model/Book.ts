import { Author } from "./Author";
import { Genre } from "./Genre";

export class Book {
  idBook: number = 0;
  idGenre: number = 0;
  genre: Genre = new Genre();
  idAuthor: number = 0;
  author: Author = new Author();
  title: string = '';
  description: string = '';
  isbn: string = '';
  isBorrowed: boolean = false;
  cover: string = '';
  publishedDate: Date = new Date();
  originalLanguage: string = '';
}