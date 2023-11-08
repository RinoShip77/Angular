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

  // Pour l'affichage des réservations dans admin
  borrowMemberNumber: string = "";
  borrowDueDate: string = "";


  determineStatus()
  {
    if(this.isActive)
    {
      return "borrowed";
    }

    if(!this.isActive)
    {
      return "cancelled";
    }

    return false;
  }
}