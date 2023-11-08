import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { getURLBookCover, getURLProfilePicture } from '../util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  theme = "";

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    let idBorrow = Number(this.route.snapshot.paramMap.get('id'));

    this.retrieveBorrow(idBorrow);

    this.url = getURLProfilePicture(this.user?.idUser);

    if(localStorage.getItem('theme') != "light")
    {
      this.theme = "dark";
    }
    else
    {
      this.theme = "";
    }
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

  constructor(private electrolibService: ElectrolibService, private datasrv: DataService, private route: ActivatedRoute, private modalService: NgbModal)
  {

  }

  //Ouvrir la modal pour les infos du livre
  openReturnModal(content:any) 
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });

    if(this.borrow.calculateFee() == null)
    {

      this.window = "> Remettre l'emprunt";
    } 
    else
    {

      this.window = "> Payer les frais";
    }
    

    modalRef.result.finally(() =>
    {
      this.window = "";
    });
  }
}
