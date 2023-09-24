import { Book } from "./Book";
import { User } from "./User";

export class Borrow {
  idBorrow: number = 0;
  idUser: number = 0;
  user: User = new User();
  idBook: number = 0;
  book: Book = new Book();
  borrowedDate: Date = new Date();
  dueDate: Date = new Date();
  returnedDate: Date = new Date();
}