import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';
import { Book } from '../model/Book';

@Component({
  selector: 'app-borrow-details',
  templateUrl: './borrow-details.component.html',
  styleUrls: ['./borrow-details.component.css']
})
export class BorrowDetailsComponent {

  visible = false;
  borrow: Borrow = new Borrow();
  user: User = new User();
  book: Book = new Book();

  @Output() openBorrows = new EventEmitter<User>();

  constructor(private electrolibService: ElectrolibService)
  {

  }

  //Lorsqu'on appele et ouvre ce commentaire
  onBorrowDetails(data:any)
  {
    this.borrow = data.selectedBorrow;
    this.user = data.user;
    this.visible = true;

    this.electrolibService.getBook(this.borrow.book.idBook).subscribe(
      book => {
        this.book = book;
      }
    );

  }

  //Retourne à la page de tous les emprunts
  borrows()
  {
    this.openBorrows.emit(this.user);
    this.visible = false;
  }

}
