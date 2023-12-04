import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';
import { Author } from '../model/Author';
import { User } from '../model/User';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  theme = "";

  @ViewChild('errorBorrowModal', {static:true}) templateRef: TemplateRef<any> | undefined;
  errorBorrowReason = "";
  errorFrais = false;

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  async ngOnInit() {
    this.user = this.dataSrv.getUser();

    if (localStorage.getItem('theme') != "light") {
      this.theme = "dark";
    }
    else {
      this.theme = "";
    }

    console.log("Onint detailsBook");
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      await this.electrolibSrv.getBook(id).subscribe(receivedBook => {
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
  }


  createBorrow() {

    if (this.user) {

      //Vérifie si le user a des frais liés à son compte
      if (this.user.fees == 0) 
      {
        //Va chercher les emprunts du user pour vérifier ses frais
        this.electrolibSrv.getBorrowsFromUser(this.user).subscribe(
          borrowsData => {
            let borrows: Borrow[] = borrowsData;
            borrows = borrowsData.map(x => (Object.assign(new Borrow(), x)));

            //Vérifie si le client a atteint la limite d'emprunts, qui est de 5
            //Si c'st le cas, il ne peut plus emprunter
            if(borrows.length > 5)
            {
              this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
              this.errorBorrowReason = "Vous avez atteint la limite d'emprunts (5)";
              return;
            }

            //Vérifie dans chaque emprunt, pour voir s'il y a des frais
            let feesBorrows = false;
            borrows.forEach(borrow => 
            {
              if (borrow.calculateFee() != null) 
              {
                feesBorrows = true;
              }
            });

            //Si aucun frais, le user pour emprunt
            if (feesBorrows == false) 
            {
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
              }
            }
            else
            {
              this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
              this.errorBorrowReason = "Vous avez des frais sur un de vos emprunts. Vous devez le remettre.";
              this.errorFrais = true;
            }
          }
        );
      }
      else
      {
        this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
        this.errorBorrowReason = "Vous avez des frais de compte";
        this.errorFrais = true;
      }
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

    //Actualiser la liste des reviews
    await this.retrieveReviews(this.book);
  }
}
