import { Component,ElementRef } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { getURLBookCover } from '../util';
import { Recommendations } from '../model/Recommendations';
import { concat, delay } from 'rxjs';
import { Borrow } from '../model/Borrow';
import { tr } from 'date-fns/locale';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stats } from '../model/stats';


@Component({
  selector: 'app-page-recommended',
  templateUrl: './page-recommended.component.html',
  styleUrls: ['./page-recommended.component.css']
})
export class PageRecommendedComponent {
  user: any;
  
  displayMenu:boolean=false;
  slideIndex:number = 1;
  displayedBooks:Book[]=[];
  recommendedBooks: Book[]=[];
  recommendations:Recommendations= new Recommendations();
  UserStats:Stats= new Stats();

  isHistory=true;
  isFavorite=true;
  isRec=false;

  
  book: Book = new Book();

  constructor(private router:Router,private electrolibSrv: ElectrolibService,private route: ActivatedRoute,private elementRef:ElementRef,private dataSrv: DataService, private modalService: NgbModal){

  }

  openInfoBorrow(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  setBorrow(){
    this.isHistory=true;
    this.isFavorite=false;
    this.isRec=false;
  }

  setAdmin(){
    this.isRec=true;
    this.isFavorite=false;
    this.isHistory=false;
  }

  setFav(){
    this.isFavorite=true;
    this.isRec=false;
    this.isHistory=false;
  }
  setAll(){
    this.isHistory=true;
    this.isFavorite=true;
    this.isRec=true;
  }

  ngOnInit() {
    console.log("recommended works");
    this.user = this.dataSrv.getUser();

    if(this.user.idUser){
     this.electrolibSrv.getRecommended(this.user.idUser).subscribe(receivedBooks =>{
      this.recommendations = receivedBooks;
      this.findOptimizedRecommendations();
      this.displayedBooks=this.recommendedBooks;
      
  })};

    if(this.user){
      this.electrolibSrv.getStats(this.user.idUser).subscribe(
        receivedStats =>{
          this.UserStats=receivedStats;
        }
      )
    }
  }

  findOptimizedRecommendations(){
    this.findBookInAll();
    this.findBookInTwo();
    this.findBookInOne();
    console.log(this.recommendedBooks);
  }

  findBookInAll(){
   this.recommendations.fromAdmin.forEach(admin => {
    this.recommendations.fromBorrows.forEach(Borrow => {
      this.recommendations.fromFavorites.forEach(fav => { 
        if((admin.idBook==Borrow.idBook&&admin.idBook==fav.idBook)&&this.checkIfInList(admin)){
          this.recommendedBooks.push(admin);
        }
      });
    });
   });
  }

  findBookInTwo(){
    this.recommendations.fromAdmin.forEach(admin => {
      this.recommendations.fromBorrows.forEach(borrows => {
        if(admin.idBook==borrows.idBook&&this.checkIfInList(admin)){
          this.recommendedBooks.push(admin);
        }
      });
    });
    this.recommendations.fromAdmin.forEach(admin => {
      this.recommendations.fromFavorites.forEach(fav => {
        if(admin.idBook==fav.idBook&&this.checkIfInList(admin)){
          this.recommendedBooks.push(fav);
        }
      });
    });
    this.recommendations.fromFavorites.forEach(fav => {
      this.recommendations.fromBorrows.forEach(borrows => {
        if(fav.idBook==borrows.idBook&&this.checkIfInList(fav)){
          this.recommendedBooks.push(fav);
        }
      });
    });
  }

  findBookInOne(){
    this.recommendations.fromAdmin.forEach(admin => {
      if(this.checkIfInList(admin)){
        this.recommendedBooks.push(admin);
      }
    });

    this.recommendations.fromBorrows.forEach(borrow => {
      if(this.checkIfInList(borrow)){
        this.recommendedBooks.push(borrow);
      }
    });

    this.recommendations.fromFavorites.forEach(fav => {
      if(this.checkIfInList(fav)){
        this.recommendedBooks.push((fav));
      };
    })
  }


  checkIfInList(book:Book){
    let flag = true;
    this.recommendedBooks.forEach(recBook => {
      if(book.idBook==recBook.idBook){
        flag = false;
      }
    });
    return flag;
  }

  displayBook(idBook: number) {
    //console.log(idBook)
    this.router.navigate(['detailLivre',idBook]);
  }

  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }
}
