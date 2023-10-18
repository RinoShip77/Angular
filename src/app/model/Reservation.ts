import { User } from "./User";
import { Book } from "./Book";
import { Borrow } from "./Borrow";

export class Reservation 
{
  idReservation: number = 0;
  idUser: number = 0;
  user: User = new User();
  idBook: number = 0;
  book: Book = new Book();
  borrow:Borrow = new Borrow();
  reservationDate: Date = new Date();
  isActive: number = 1;

  determineStatus()
  {
    if((this.idReservation % 3) == 1)
    {
      return "cancelled";
    }

    if((this.idReservation % 3) == 2)
    {
      return "borrowed";
    }

    if((this.idReservation % 3) == 0)
    {
      return "ordered";
    }

    return false;
  }
}