import { Component, EventEmitter, Output } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';

@Component({
  selector: 'app-borrow-details',
  templateUrl: './borrow-details.component.html',
  styleUrls: ['./borrow-details.component.css']
})
export class BorrowDetailsComponent {

  visible = false;
  borrow: Borrow = new Borrow();
  user: User = new User();

  @Output() openBorrows = new EventEmitter<User>();

  //Lorsqu'on appele et ouvre ce commentaire
  onBorrowDetails(borrow: Borrow)
  {
    this.borrow = borrow;
    //this.user = user;
    this.visible = true;
  }

  //Retourne à la page de tous les emprunts
  borrows()
  {
    this.openBorrows.emit(this.user);
    this.visible = false;
  }
}
