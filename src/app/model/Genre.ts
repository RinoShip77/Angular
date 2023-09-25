import { Book } from "./Book";

export class Genre {
  idGenre: number = 0;
  name: string = '';
  icon: string = '';
  books: Book[] = new Array();
  isFilter: boolean = false;
}