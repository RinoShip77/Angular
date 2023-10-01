import { User } from "./User";
import { Book } from "./Book";

export class Reservation {
  idReservation: number = 0;
  user: User = new User();
  book: Book = new Book();
  reservationDate: Date = new Date();
}