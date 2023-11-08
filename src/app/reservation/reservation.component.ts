import { Component, Output, EventEmitter, OnInit} from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from '../model/Reservation';
import { Borrow } from '../model/Borrow';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { getURLBookCover } from '../util';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  user: User | undefined = new User();
  reservations:Reservation[] = new Array();
  borrow:Borrow = new Borrow();

   //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  theme = "";

  selectedReservation:Reservation = new Reservation();

  //Fenêtre dans laquelle on se trouve
  window:string = "";

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    this.retrieveReservations();
    this.window = "";

    if(localStorage.getItem('theme') != "light")
    {
      this.theme = "dark";
    }
    else
    {
      this.theme = "";
    }
    
  }

  getBookCover(idBook: number) 
  {
    return getURLBookCover(idBook);
  }

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService) { }

  //Cherche tous les reservations en bd
  retrieveReservations()
  {
    if(this.user)
    {
      this.electrolibService.getReservationsFromUser(this.user).subscribe(
        reservations => 
        {
          
          this.reservations = reservations.map(x => (Object.assign(new Reservation(), x)));
        }
      );
    } 
  }

  async cancelReservation(reservation: Reservation)
  {
    await this.electrolibService.cancelReservationUser(reservation).subscribe();
    await this.retrieveReservations();
  }

  async reactivateReservation(reservation: Reservation)
  {
    await this.electrolibService.reactivateReservationUser(reservation).subscribe();
    await this.retrieveReservations();
  }

  openAbout(content:any) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true});
    
    this.window = "> à propos";

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }

  //Ouvrir la modal pour les infos du livre
  openReservationModal(content:any, selectedReservation:Reservation) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
    this.selectedReservation = selectedReservation;
    this.window = "> détails de la réservation";

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }

  //Ouvrir la modal [Confirmer le renouvelement], qui confirme si le user veut vraiment renouveler
  openCancelModal(content:any, selectedReservation:Reservation) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', animation:true, });
    this.selectedReservation = selectedReservation;

    if(selectedReservation.isActive)
    {
      this.window = "> annuler la réservation (" + selectedReservation.book.title + ")";
    }
    else
    {
      this.window = "> réactiver la réservation (" + selectedReservation.book.title + ")";
    }

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }

  save()
  {
    if(this.selectedReservation.isActive)
    {
      this.cancelReservation(this.selectedReservation);
    }
    else
    {
      this.reactivateReservation(this.selectedReservation);
    }

    this.modalService.dismissAll();
  }

  //Tri par la valeur
  //Si on clique sur le selectbox plutôt que la colonne
  orderBySelect($event:any)
  {
    this.sortBy($event.target.value);
  }

  //Descendant ou Ascendant
  //Si on clique sur le selectbox plutôt que la colonne
  orderWayBySelect($event:any)
  {
    if($event.target.value == 'ASC')
    {
      if(this.desc == true)
      {
        this.desc = false;
        this.reservations = this.reservations.map(x => Object.assign(new Reservation(), x)).reverse();
      }
    }
    else
    {
      if(this.desc == false)
      {
        this.desc = true;
        this.reservations = this.reservations.map(x => Object.assign(new Reservation(), x)).reverse();
      }
    }

  }

  //Tri le tableau par la colonne selectionnée
  //Soit en cliquant sur la colonne
  //Où dans la liste
  sortBy($event:any)
  {
    if(this.sortBefore == $event)
    {
      this.desc = !this.desc;
    }
    else
    {
      this.desc = false;
    }
    this.sortBefore = $event;

    //Vérifie si on sélectionne le tri par titre
    //Qui contrairement aux autres,
    //n'est pas géré par une requête sql
    if($event == 'title')
    {
      this.sortByTitle();

      return;
    }

    if($event == 'status')
    {
      this.sortByStatus($event);

      return;
    }

    //Sélection et tri pour les données de l'emprunt
    if(this.user)
    {
    this.electrolibService.getReservationsOrderedBy(this.user, $event).subscribe(
      reservations => {
        if(this.desc)
        {
          this.reservations = reservations.map(x => Object.assign(new Reservation(), x)).reverse();
        }
        else
        {
          this.reservations = reservations.map(x => Object.assign(new Reservation(), x));
        }
      }
    );
    }
  }

  sortByTitle()
  {
    //Tri chaque borrow de la liste de borrow
    for(let i = 0; i < this.reservations.length; i++)
    {
      //Vérifie avec chaque autre borrow
      for(let j = 0; j < this.reservations.length; j++)
      {
        if(j != i)
        {
          //Compare la valeur de 2 string
          //1 pour valeur plus grande
          //0 pour valeur égale
          //-1 pour valeur plus grande
          let plusGrand = this.reservations[i].book.title.localeCompare(this.reservations[j].book.title);

          if(this.desc)
          {
            //Lorsqu'on choisi DESC, met les plus gros à la fin de la liste
            if(plusGrand == 1)
            {
              [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
            }
          }
          else
          {
            //Lorsqu'on choisi ASC, met les plus gros au début de la liste
            if(plusGrand == -1)
            {
              [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
            }
          }
        }
      }
    }
  }

  sortByStatus(status:string)
  {
    for(let i = 0; i < this.reservations.length; i++)
    {
      for(let j = 0; j < this.reservations.length; j++)
      {
        if(!this.desc)
        {
          if(this.reservations[i].determineStatus() != "cancelled" && this.reservations[j].determineStatus() == "cancelled")
          {
            [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
          }
          else if (this.reservations[i].determineStatus() == "borrowed" && this.reservations[j].determineStatus() != "borrowed")
          {
            [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
          }
        }
        else
        {
          if(this.reservations[i].determineStatus() == "cancelled" && this.reservations[j].determineStatus() != "cancelled")
          {
            [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
          }
          else if (this.reservations[i].determineStatus() != "borrowed" && this.reservations[j].determineStatus() == "borrowed")
          {
            [this.reservations[i], this.reservations[j]] = [this.reservations[j], this.reservations[i]];
          }
        }
      }
    }
  }
}
