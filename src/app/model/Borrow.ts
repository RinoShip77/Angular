import { Book } from "./Book";
import { User } from "./User";

export class Borrow 
{
    idBorrow:number = 0;
    idUser:number = 0;
    idBook:number = 0;
    borrowedDate: Date = new Date();
    dueDate: Date = new Date();
    returnedDate: Date = new Date();
    user: User = new User();
    book: Book = new Book();

    //Calcul le temps restant à l'emprunt
    calculateTime()
    {
      var borrowedDate = new Date(this.borrowedDate);
      var dueDate = new Date(this.dueDate);
    
      var daysRemaining = Math.round(((dueDate.getTime() - borrowedDate.getTime()) / (1000 * 3600 * 24)) * 100) / 100;
      
      return daysRemaining;
    
    }

    //retourne les jours en positif si emprunt en retard
    //et arrondis pour l'interface
    //mais les transforment en jours de retard
    transformTimeAndLate()
    {
        if(this.calculateTime() <= 1)
        {
            return Math.round(this.calculateTime() * - 1);
        }
        else
        {
            return Math.round(this.calculateTime());
        }
    }

    //Détermine le status de l'emprunt (en retard, etc.)
    determineStatus()
    {
        if(this.calculateTime() > 7 )
        {
            return "green";
        }
        else if (this.calculateTime() > 1)
        {
            return "yellow";
        }
        else if (this.calculateTime() > 0)
        {
            return "orange";
        }
        else
        {
            return "En retard";
        }
    }

    //Calcul les frais de l'emprunt
    calculateFee()
    {
         //2$ de couts dès le début d'une semaine de retard

        if(this.calculateTime() <= 0)
        {
            return Math.ceil((this.calculateTime() * - 1) / 7) * 2;
        }
        else
        {
            return null;
        }
    }
}