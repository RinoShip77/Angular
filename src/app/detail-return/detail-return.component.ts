import { Component } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';

@Component({
  selector: 'app-detail-return',
  templateUrl: './detail-return.component.html',
  styleUrls: ['./detail-return.component.css']
})
export class DetailReturnComponent {
  visible = false;
  borrow: Borrow = new Borrow();
  user: User = new User();


  //Lorsqu'on appele et ouvre ce commentaire
  onBorrowDetails(data:any)
  {

    console.log("détails de l'emprunt 2")
    this.borrow = data.selectedBorrow;
    this.user = data.user;
    this.visible = true;
  }

  //Retourne à la page de tous les emprunts
  borrows()
  {
    this.visible = false;
  }
}
