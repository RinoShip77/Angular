import { Book } from "./Book";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { addMonths, format, parse} from 'date-fns';
import { addYears, formatWithOptions } from 'date-fns/fp'
import { eo } from 'date-fns/locale'
import {formatDate} from '@angular/common';
import { User } from "./User";

export class Borrow 
{
    idBorrow:number = 0;

    idUser:number = 0;

    book:Book = new Book();

    borrowedDate: Date = new Date();

    dueDate: Date =  new Date();

    returnedDate: Date = new Date();

    user: User = new User();
    

    //Calcul le temps restant à l'emprunt
    calculateTime()
    {
      var dueDate = new Date(this.dueDate);
    
      var daysRemaining = Math.round(((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24)) * 100) / 100;
      
      return daysRemaining;
    
    }

    //retourne les jours en positif si emprunt en retard
    //et arrondis pour l'interface
    //mais les transforment en jours de retard
    transformTimeAndLate()
    {
        if(this.calculateTime() <= 0)
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
            return "En cours";
        }
        else if (this.calculateTime() > 1)
        {
            return "Semi-urgent";
        }
        else if (this.calculateTime() > 0)
        {
            return "Urgent";
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

    //Calcul le nombre de renouvellement fait, chaque mois de plus que le premier,
    //équivaut à 1 renouvellement
    getRenewTimes()
    {
        var borrowedDate = new Date(this.borrowedDate);
        var dueDate = new Date(this.dueDate);
        if((Math.round(((dueDate.getTime() - borrowedDate.getTime()) / (1000 * 3600 * 24)) / 30)) - 1 >= 0)
        {

            return (Math.round(((dueDate.getTime() - borrowedDate.getTime()) / (1000 * 3600 * 24)) / 30)) - 1;
        }
        else
        {
            return 0;
        }
    }

    //Calcul le nombre de renouvellement fait, chaque mois de plus que le premier,
    //équivaut à 1 renouvellement
    getRenewsLeft()
    {
        return 2 - this.getRenewTimes();
    }


    //Vérifie le nombre de renouvellement de l'emprunt
    verifyRenew()
    {

        if(this.calculateFee() == null)
        {
            //L'utilisateur a renouvelé 2 fois 
            if(this.getRenewTimes() >= 2)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    renew()
    {
        var dueDate = new Date(this.dueDate);
        if(this.verifyRenew())
        {
            dueDate.setDate( dueDate.getDate() + 30 );
            this.dueDate = dueDate;
        }
        return this.dueDate;   
    }

    formattedDueDate()
    {
        return (moment(this.dueDate)).format('yyyy-MM-DD HH:mm:ss')
    }

    renewReason()
    {
        if(this.calculateFee() != null)
        {
            return "Des frais doivent être payés";
        }

        if(this.getRenewTimes() >= 2)
        {
            return "Le maximum de renouvellement a été atteint";
        }

        return "";
    }
}