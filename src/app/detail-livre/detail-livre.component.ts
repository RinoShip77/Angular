import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';
import { Author } from '../model/Author';
import { User } from '../model/User';
import { DataService } from '../data.service';
import { Reservation } from '../model/Reservation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private dataSrv: DataService, private router: Router, private electrolibSrv: ElectrolibService, private route: ActivatedRoute,
    private modalService: NgbModal) {

  }
  isAvailable = false;
  user: User | undefined = new User();
  book: Book = new Book();
  genre: Genre = new Genre();
  author: Author = new Author();
  nbrLike = 0;
  btnVisible = true;
  Succes = false;
  failure = false;
  isLiked = false;
  isBookReservedByCurrentUser: Boolean = true;
  isBookBorrowedByCurrentUser: Boolean = true;

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    this.user = this.dataSrv.getUser();

    console.log("Onint detailsBook");
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.electrolibSrv.getBook(id).subscribe(receivedBook => {
        this.book = receivedBook;
        if (this.book.idStatus == 1) {
          this.isAvailable = true;
        }

        //je mets le code pour aller chercher le genre ici, je pense que subsrcibe fait un bug sinon
        this.electrolibSrv.getGenre(this.book.idGenre).subscribe(receivedGenre => {
          this.genre = receivedGenre;
          // console.log(this.genre);
        });

        this.electrolibSrv.getAuthor(this.book.idAuthor).subscribe(receivedAuthor => {
          this.author = receivedAuthor;
        });

        this.electrolibSrv.getFavoriteNbr(this.book.idBook).subscribe(receivedNbr => {
          this.nbrLike = receivedNbr;
        });

        if (this.user) {
          this.electrolibSrv.getIfFavorited(this.book, this.user).subscribe(receivedValue => {
            if (receivedValue == 1) {
              this.isLiked = true;
            }
          });
        }
      });
    }


    this.findOneReservation(this.user?.idUser, id);
    this.findOneBorrow(this.user?.idUser, id);
  }


  createBorrow() {
    if (this.user) {
      this.electrolibSrv.createBorrow(this.user.idUser, this.book.idBook).subscribe(
        receivedBorrow => {
          console.log(receivedBorrow);
          if (receivedBorrow == null) {
            this.failureBorrow();
          }
          else {
            this.router.navigate(["borrowDetails", receivedBorrow])
          }
        }
      )
    };
  }

  succesBorrow() {
    this.btnVisible = false;
    this.Succes = true;
  }

  failureBorrow() {
    this.btnVisible = false;
    this.failure = true;
  }

  Acceuil() {
    this.router.navigate(['inventory']);
  }

  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }

  AjoutFav() {
    if (this.user) {
      console.log(this.book);
      this.electrolibSrv.createFavorite(this.book, this.user).subscribe(
        receivedFavorite => {
        }
      )
    };
    this.nbrLike = this.nbrLike + 1;
    this.isLiked = true;
  }

  deleteFav() {
    if (this.user) {
      this.electrolibSrv.deleteFavorite(this.book, this.user).subscribe(receivedValue => {
        if (receivedValue == 1) {
          this.nbrLike = this.nbrLike - 1;
          this.isLiked = false;
        }
      });
    }

  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  findOneReservation(idUser: Number | undefined, idBook: Number) {
    this.electrolibSrv.findOneReservationFromUser(idUser, idBook).subscribe(
      reservation => {
        this.isBookReservedByCurrentUser = reservation;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  findOneBorrow(idUser: Number | undefined, idBook: Number) {
    this.electrolibSrv.findOneBorrowFromUser(idUser, idBook).subscribe(
      borrow => {
        this.isBookBorrowedByCurrentUser = borrow;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  reserveBook() {
    if (this.user && this.user.idUser !== undefined && this.book && this.book.idBook !== undefined) {
      this.electrolibSrv.createReservation(this.user.idUser, this.book.idBook).subscribe(
        (response) => {
          console.log('Reservation created successfully!', response);
          this.isBookReservedByCurrentUser = true;
        }
      );
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openConfirmReservation(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

}
