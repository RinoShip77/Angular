import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Borrow } from '../model/Borrow';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-borrows',
  templateUrl: './borrows.component.html',
  styleUrls: ['./borrows.component.css']
})
export class BorrowsComponent implements OnInit {
  visible = false;
  user: User = new User();
  borrows: Borrow[] = new Array();

  //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  ngOnInit(): void 
  {
    
  }

  @Output() openBorrowDetails = new EventEmitter<{selectedBorrow:Borrow, user:User}>();
  @Output() openInventory = new EventEmitter<User>();
  @Output() openHistory = new EventEmitter<User>();

  aboutModal:any;

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal) { }

  //Lorsqu'on appele et ouvre le component
  onBorrows(user: User) 
  {
    //TODO
    //1 Dans symfony, pour ici, un where returnedDate == null
    //2 Dans symfony, pour l'historique, un where returnedDate != null
    //3 Push la date, et la formatter dans le symfony


    //Livre perdu???
    //Livre abimé???

    this.visible = true;
    this.user = user;
    this.retrieveBorrows();

    //TODO COTÉ INVENTAIRE (PAS MOI)
    //Si le user a des frais, il ne peut plus emprunter jusqu'à ce qu'il paie
    //Le user peut avoir un maximum de 5 emprunts

    //TODO
    //Check si membre pour bd et symfony
  }

  //Cherche tous les emprunts en bd
  retrieveBorrows()
  {
    this.electrolibService.getBorrowsFromUser(this.user).subscribe(
      borrows => {
        
        this.borrows = borrows.map(x => (Object.assign(new Borrow(), x)));
      }
    );
  }

  //Affiche les détails de l'emprunt choisi
  borrowDetails(selectedBorrow: Borrow)
  {
    console.log("détails de l'emprunt")

    let user = this.user;
    
    this.openBorrowDetails.emit({selectedBorrow:selectedBorrow, user:user});
    this.visible = false;
  }

  //Affiche les détails de l'emprunt choisi
  history()
  {
    console.log("historique d'emprunts")

    this.openHistory.emit(this.user);
    this.visible = false;
  }

  //Renouvellement d'un emprunt
  borrowRenew(selectedBorrow: Borrow)
  {
    selectedBorrow.renew();
    
    //Revérifier dans le symfonie pour empêcher le user de jouer avec le code source

    //ICI
    //Appele le symfony,
    //update la date de retour
  }

  //Ouvrir la modal [à propos], qui explique tout ce qu'il faut savoir sur le système d'emprunts
  openAbout(content:any) 
  {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true});
  }

  selectedBorrowModal: Borrow = new Borrow;

  //Ouvrir la modal [Confirmer le renouvelement], qui confirme si le user veut vraiment renouveler
  openRenewModal(content:any, selectedBorrowModal:Borrow) 
  {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', animation:true, });
    this.selectedBorrowModal = selectedBorrowModal;
  }

  save()
  {
    this.borrowRenew(this.selectedBorrowModal);
    this.modalService.dismissAll();
  }

  //Retourner à la page inventaire
  returnInventory()
  {
    this.openInventory.emit(this.user);
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
