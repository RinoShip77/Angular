import { User } from "./User";
import { Book } from "./Book";

export class Evaluation {
  idEvaluation: number = 0;
  idUser: number = 0;
  user: User = new User();
  idBook: number = 0;
  book: Book = new Book();
  score: number = 0;
}