import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Borrow } from '../model/Borrow';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getURLBookCover } from '../util';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{

  user: User | undefined = new User();
  borrows: Borrow[] = new Array();

  @Output() openBorrows = new EventEmitter<User>();

  selectedBorrow:Borrow = new Borrow();

  //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  window:string = "";

  theme = "";

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    this.retrieveBorrows();
    
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

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService){}

  retrieveBorrows()
  {
    if(this.user)
    {
    this.electrolibService.getBorrowsHistoryFromUser(this.user).subscribe(
      borrows => {
        
        this.borrows = borrows.map(x => Object.assign(new Borrow(), x));
      }
    );
    }
  }

  //Ouvrir la modal pour les infos du livre
  openBorrowModal(content:any, selectedBorrow:Borrow) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
    this.selectedBorrow = selectedBorrow;

    this.window = "> détails de l'emprunt (" + selectedBorrow.book.title + ")";

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }

  //Ouvrir la modal [à propos], qui explique tout ce qu'il faut savoir sur le système d'emprunts
  openAbout(content:any) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true});

    this.window = "> à propos";

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
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
        this.borrows = this.borrows.map(x => Object.assign(new Borrow(), x)).reverse();
      }
    }
    else
    {
      if(this.desc == false)
      {
        this.desc = true;
        this.borrows = this.borrows.map(x => Object.assign(new Borrow(), x)).reverse();
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

    //Sélection et tri pour les données de l'emprunt
    if(this.user)
    {
    this.electrolibService.getBorrowsHistoryOrderedBy(this.user, $event).subscribe(
      borrows => {
        if(this.desc)
        {
          this.borrows = borrows.map(x => Object.assign(new Borrow(), x)).reverse();
        }
        else
        {
          this.borrows = borrows.map(x => Object.assign(new Borrow(), x));
        }
      }
    );
    }
  }

  sortByTitle()
  {
    //Tri chaque borrow de la liste de borrow
    for(let i = 0; i < this.borrows.length; i++)
    {
      //Vérifie avec chaque autre borrow
      for(let j = 0; j < this.borrows.length; j++)
      {
        if(j != i)
        {
          //Compare la valeur de 2 string
          //1 pour valeur plus grande
          //0 pour valeur égale
          //-1 pour valeur plus grande
          let plusGrand = this.borrows[i].book.title.localeCompare(this.borrows[j].book.title);

          if(this.desc)
          {
            //Lorsqu'on choisi DESC, met les plus gros à la fin de la liste
            if(plusGrand == 1)
            {
              [this.borrows[i], this.borrows[j]] = [this.borrows[j], this.borrows[i]];
            }
          }
          else
          {
            //Lorsqu'on choisi ASC, met les plus gros au début de la liste
            if(plusGrand == -1)
            {
              [this.borrows[i], this.borrows[j]] = [this.borrows[j], this.borrows[i]];
            }
          }
        }
      }
    }
  }
}
