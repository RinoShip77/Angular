import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { getURLBookCover, getURLProfilePicture } from '../util';

@Component({
  selector: 'app-borrow-details',
  templateUrl: './borrow-details.component.html',
  styleUrls: ['./borrow-details.component.css']
})
export class BorrowDetailsComponent implements OnInit {

  borrow: Borrow = new Borrow();
  user: User | undefined = new User();
  book:Book = new Book();

  idBook = 0;

  window:string = "";
  url:string = "";

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    let idBorrow = Number(this.route.snapshot.paramMap.get('id'));

    this.retrieveBorrow(idBorrow);

    this.url = getURLProfilePicture(this.user?.idUser);
  }

  retrieveBorrow(idBorrow:Number)
  {
    if(this.user)
    {
      this.electrolibService.getBorrow(idBorrow).subscribe(
        borrow => {
          this.borrow = Object.assign(new Borrow(), borrow);
          this.idBook = borrow.book.idBook;
          this.retrieveBook(this.idBook);
        }
      );
    }
  }

  retrieveBook(idBook:number)
  {
    if(this.user)
    {
      this.electrolibService.getBookBorrowed(idBook).subscribe(
        book => {
          this.book = Object.assign(new Book(), book)
          console.log(idBook)
        }
      );
    }
  }

  getBookCover(idBook: number) 
  {
    return getURLBookCover(idBook);
  }

  constructor(private electrolibService: ElectrolibService, private datasrv: DataService, private route: ActivatedRoute)
  {

  }
}
