import { User } from "./User";
import { Book } from "./Book";

export class Favorite {
  idFavorite: number = 0;
  user: User = new User();
  book: Book = new Book();
  favoriteDate: Date = new Date();
}