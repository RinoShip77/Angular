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
    //if(this.borrow.idBorrow != null)
    //{
    //  return "emprunté";
    //}

    if(this.isActive)
    {
      return "Active";
    }

    if(!this.isActive)
    {
      return "Annulée";
    }

    return false;
  }

  getReservationTimeElapsed()
  {
    var reservationDate = new Date(this.reservationDate);
    return Math.floor(Math.round(((Date.now() - reservationDate.getTime()) / (1000 * 3600 * 24)) * 100) / 100);
  }
}