import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-borrow-details',
  templateUrl: './borrow-details.component.html',
  styleUrls: ['./borrow-details.component.css']
})
export class BorrowDetailsComponent implements OnInit {

  borrow: Borrow = new Borrow();
  user: User | undefined = new User();
  book:Book = new Book();

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    const idBorrow = Number(this.route.snapshot.paramMap.get('id'));

    this.retrieveBorrow(idBorrow);
  }

  retrieveBorrow(idBorrow:Number)
  {
    if(this.user)
    {
      this.electrolibService.getBorrow(idBorrow).subscribe(
        borrow => {
          this.borrow = Object.assign(new Borrow(), borrow);
        }
      );

      this.electrolibService.getBookBorrowed(this.borrow.book.idBook).subscribe(
        book => {
          this.book = Object.assign(new Book(), book)
        }
      );
    }
  }

  constructor(private electrolibService: ElectrolibService, private datasrv: DataService, private route: ActivatedRoute)
  {

  }
}
