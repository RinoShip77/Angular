import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Borrow } from '../model/Borrow';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-borrows',
  templateUrl: './borrows.component.html',
  styleUrls: [`./borrows.component.css`]
})
export class BorrowsComponent implements OnInit {
  
  user: User | undefined = new User();
  borrows: Borrow[] = new Array();

  //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  window:string = "";

  test:string = "light";

  theme = "";

  styleUrl : string = './app.component.css';
  changeCSSStyle() {
    this.styleUrl = (this.styleUrl === './borrows.component.css') ? './borrows.component.dark.css' : './borrows.component.dark.css';
  }

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    this.reloadUser();
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

  aboutModal:any;

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService, private dataService: DataService) {

    
  }

  //Lorsqu'on appele et ouvre le component
  onBorrows(user: User) 
  {

    //TODO
    //Priority of reservation
    //

    //Changer le nom des status en retard... etc
    //Livre perdu???
    //Livre abimé???


    //TODO COTÉ INVENTAIRE (PAS MOI)
    //Si le user a des frais, il ne peut plus emprunter jusqu'à ce qu'il paie
    //Le user peut avoir un maximum de 5 emprunts


  }

  //Cherche tous les emprunts en bd
  retrieveBorrows()
  {
    if(this.user)
    {
    this.electrolibService.getBorrowsFromUser(this.user).subscribe(
      borrows => {
        
        this.borrows = borrows.map(x => (Object.assign(new Borrow(), x)));
      }
    );
  }
}

  //Renouvellement d'un emprunt
  async borrowRenew(selectedBorrow: Borrow)
  {
    if(selectedBorrow.verifyRenew())
    {
      //Update l'entity pour être sûr qu'il n'y aie pas dde bug dans le html
      selectedBorrow.renew();

      //update la date dans la bd
      await this.electrolibService.renewDueDate(selectedBorrow).subscribe();

      //Retourne chercher les emprunts updatés
      await this.retrieveBorrows();
    }
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

  selectedBorrowModal: Borrow = new Borrow;

  //Ouvrir la modal [Confirmer le renouvelement], qui confirme si le user veut vraiment renouveler
  openRenewModal(content:any, selectedBorrowModal:Borrow) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', animation:true, });
    this.selectedBorrowModal = selectedBorrowModal;

    this.window = "> renouveler l'emprunt (" + selectedBorrowModal.book.title + ")";

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }

  save()
  {
    this.borrowRenew(this.selectedBorrowModal);
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
    if (this.user) {
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

  openFeesModal(content:any)
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
  }

  dismissModal()
  {
    this.reloadUser();
    this.modalService.dismissAll();
  }

  reloadUser()
  {
    if(this.user)
    {
      this.electrolibService.connection(this.user).subscribe(
        connectedUser => 
        {
          
          if(this.user)
          {
            
            this.user = connectedUser;
            this.datasrv.updateUser(this.user);
          }
        }
      )
    }
  }
}
