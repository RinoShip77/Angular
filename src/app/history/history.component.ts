import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  visible=false;
  user: User = new User();
  borrows: Borrow[] = new Array();

  @Output() openBorrows = new EventEmitter<User>();

  //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  constructor(private electrolibService: ElectrolibService){}

  onHistory(user:User)
  {
    this.visible=true;
    this.user = user;
    
    this.retrieveBorrows();
  }

  retrieveBorrows()
  {
    this.electrolibService.getBorrowsFromUser(this.user).subscribe(
      borrows => {
        
        this.borrows = borrows.map(x => Object.assign(new Borrow(), x));
      }
    );
  }

  returnBorrows()
  {
    this.openBorrows.emit(this.user);
    this.visible = false;
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
    this.electrolibService.getBorrowsOrderedBy(this.user, $event).subscribe(
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
