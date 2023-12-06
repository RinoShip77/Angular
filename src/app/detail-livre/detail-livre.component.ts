import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { getURLBookCover, getURLProfilePicture } from '../util';
import { Genre } from '../model/Genre';
import { Author } from '../model/Author';
import { User } from '../model/User';
import { DataService } from '../data.service';
import { Reservation } from '../model/Reservation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Review } from '../model/Review';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private dataSrv: DataService, private router: Router, private electrolibSrv: ElectrolibService, private route: ActivatedRoute, private modalService: NgbModal) {

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
  reservationToCancel: any = null;
  bookIsReserved = false;

  theme = "";

  @ViewChild('errorBorrowModal', { static: true }) templateRef: TemplateRef<any> | undefined;
  errorBorrowReason = new Array();
  errorFrais = false;

  url = "";

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  async ngOnInit() {
    this.user = this.dataSrv.getUser();
    this.url = getURLProfilePicture(this.user?.idUser, this.user?.profilePicture);

    if (localStorage.getItem('theme') != "light") {
      this.theme = "dark";
    }
    else {
      this.theme = "";
    }

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

        this.retrieveReviews(this.book);
      });
    }


    this.findOneReservation(this.user?.idUser, id);
    this.findOneBorrow(this.user?.idUser, id);
  }


  createBorrow() {
    this.errorBorrowReason = new Array();

    if (this.user) {

      // Récupère les réservations en cours sur le livre
      this.electrolibSrv.getBookReservations(this.book.idBook).subscribe(
        (reservations) => {
          if (reservations.length > 0) {

            // Si le livre est réservé
            if (reservations.length > 0) {
              reservations.sort((a, b) => (a.reservationDate > b.reservationDate ? 1 : -1));

              // Si le premier livre de la liste est réservé par le membre sélectionné
              if (reservations[0].user.idUser === this.user?.idUser) {
                this.reservationToCancel = reservations[0];
              }
              else {
                this.bookIsReserved = true;
                this.errorBorrowReason.push("Le livre est réservé par un autre membre");
              }
            }
          }

          let accountFee = false;
          if (this.user!.fees != 0) {
            accountFee = true;
            this.errorBorrowReason.push("Vous avez des frais de compte.");
            this.errorFrais = true;
          }

          this.electrolibSrv.getBorrowsFromUser(this.user!).subscribe(
            borrowsData => {
              let borrows: Borrow[] = borrowsData;
              borrows = borrowsData.map(x => (Object.assign(new Borrow(), x)));

              //Vérifie si le client a atteint la limite d'emprunts, qui est de 5
              //Si c'st le cas, il ne peut plus emprunter
              let tooMuchBorrows = false;
              if (borrows.length >= 5) {
                this.errorBorrowReason.push("Vous avez atteint la limite d emprunts (5)");
                tooMuchBorrows = true;
              }

              //Vérifie dans chaque emprunt, pour voir s'il y a des frais
              let feesBorrows = false;
              borrows.forEach(borrow => {
                if (borrow.calculateFee() != null && borrow.returnedDate == null) {
                  feesBorrows = true;
                  this.errorBorrowReason.push("Vous avez des frais sur un de vos emprunts. Vous devez le remettre.");
                  this.errorFrais = true;
                }
              });

              if (this.user && !this.bookIsReserved && !feesBorrows && !tooMuchBorrows && !accountFee) {
                // Crée l'emprunt
                this.electrolibSrv.createBorrow(this.user.idUser, this.book.idBook).subscribe(
                  receivedBorrow => {
                    if (receivedBorrow == null) {
                      this.failureBorrow();
                    }
                    else {
                      console.log('Borrow created successfully!', receivedBorrow);
                      this.isAvailable = false;
                      this.isBookBorrowedByCurrentUser = true;

                      if (this.reservationToCancel != null) {
                        // Supprime la réservation
                        this.electrolibSrv.cancelReservation(this.reservationToCancel).subscribe(
                          (cancelResponses) => {
                            console.log('Reservation cancelled successfully!', cancelResponses);
                            this.dataSrv.setIsFromBorrowFalse();
                            this.router.navigate(["borrowDetails", receivedBorrow.idBorrow])
                          },
                          (cancelError) => {
                            console.error('Cancellation failed:', cancelError);
                          }
                        );
                      }
                      this.dataSrv.setIsFromBorrowFalse();
                      this.router.navigate(["borrowDetails", receivedBorrow.idBorrow]);
                    }
                  }
                )
              }
              else {
                this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true, });
              }
            }
          );


        },
        (error) => {
          console.error('Creation failed:', error);
        }
      );
    }
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

  openConfirmBorrow(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openConfirmReservation(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  reviews: Review[] = new Array();

  @ViewChild('saveModal') saveModal!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;

  retrieveReviews(book: Book) {
    if (this.user) {
      this.electrolibSrv.getReviews(book.idBook).subscribe(
        reviews => {
          this.reviews = reviews.map(r => (Object.assign(new Review(), r)));
        }
      );
    }
  }

  starsHovered: number = 0;
  starHover(starsHovered: number) {
    this.starsHovered = starsHovered;
  }

  starsClicked: number = 0;
  starClick(starsClicked: number) {
    this.starsClicked = starsClicked;
  }

  newReviewMessage = "";
  verifyReview() {
    //Le user doit écrire au moins 5 caractères dans le message
    if (this.newReviewMessage.length >= 5 && this.newReviewMessage.length <= 500) {
      //Le user doit choisir une étoile
      if (this.starsClicked > 0) {
        //Ajoute un point s'il n'y a pas de point à la fin
        if (this.newReviewMessage[this.newReviewMessage.length] != '.' || this.newReviewMessage[this.newReviewMessage.length] != '!' || this.newReviewMessage[this.newReviewMessage.length] != '?') {
          this.newReviewMessage += '.';




        }

        this.modalService.open(this.saveModal);
      }
      else {
        this.modalService.open(this.errorModal);
      }
    }
    else {
      this.modalService.open(this.errorModal);
    }
  }

  review: Review = new Review();
  async saveReview() {

    if (this.user) {
      this.review.message = this.newReviewMessage;
      this.review.rating = this.starsClicked;
      //Envois du message en BD si oui
      await this.electrolibSrv.createReview(this.review, this.user, this.book).subscribe(
        createdComment => {
          console.log('Review créé!', createdComment);
          //Actualiser la liste des reviews
          this.retrieveReviews(this.book);
        },
        (error) => {
          console.error('Création erreur', error);
        }
      );
    }


    this.modalService.dismissAll();
    this.starsHovered = 0;
    this.starsClicked = 0;
    this.newReviewMessage = "";

    this.modalService.open(this.successModal);

  }

  urlUser(user:User)
  {
    return getURLProfilePicture(user.idUser, user.profilePicture);
  }
}
