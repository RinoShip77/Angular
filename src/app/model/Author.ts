import { Book } from "./Book";

export class Author {
  idAuthor: number = 0;
  firstName: string = '';
  lastName: string = '';
  books: Book[] = new Array();
  isFilter: boolean = false;
}