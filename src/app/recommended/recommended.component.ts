import { Component,ElementRef } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { getURLBookCover } from '../util';
import { Recommendations } from '../model/Recommendations';
import { concat, delay } from 'rxjs';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent {
  user: any;
 
  constructor(private router:Router,private electrolibSrv: ElectrolibService,private route: ActivatedRoute,private elementRef:ElementRef,private dataSrv: DataService){

  }

  displayMenu:boolean=false;
  slideIndex:number = 1;
  displayedBooks:Book[]=[];
  recommendedBooks: Book[]=[];
  recommendations:Recommendations= new Recommendations();
  
  book: Book = new Book();
  //genre: Genre = new Genre();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    console.log("recommended works");
    this.user = this.dataSrv.getUser();

    if(this.user.idUser){
     this.electrolibSrv.getRecommended(this.user.idUser).subscribe(receivedBooks =>{
      this.recommendations = receivedBooks;
      this.findOptimizedRecommendations();
      this.displayedBooks=this.recommendedBooks;
      setTimeout(() =>this.showSlides(this.slideIndex), 200);
      
  })};
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
  

  displayMenuFn(){
    console.log("menuBTN")
    if(!this.displayMenu){
      this.displayMenu=true;
    }
    else{
      this.displayMenu=false;
    }
  }

  setBorrow(){
    this.displayedBooks=this.recommendations.fromBorrows;
    setTimeout(() =>this.showSlides(1), 1);
  }

  setAdmin(){
    this.displayedBooks=this.recommendations.fromAdmin;
    setTimeout(() =>this.showSlides(1), 1);
  }

  setFav(){
    this.displayedBooks=this.recommendations.fromFavorites;
    setTimeout(() =>this.showSlides(1), 1);
  }
  setAll(){
    this.displayedBooks=this.recommendedBooks;
    setTimeout(() =>this.showSlides(1), 1);
  }

// Next/previous controls
 plusSlides(n:number) {
  this.showSlides(this.slideIndex += n);
}

// Thumbnail image controls
 currentSlide(n:number) {
  this.showSlides(this.slideIndex = n);
}

 showSlides(n:number) {
  let i;
  //let slides = document.getElementsByClassName("mySlides");
  let slides = this.elementRef.nativeElement.querySelectorAll('#mySlides');
  //console.log(slides);
  if (n > slides.length) {this.slideIndex = 1}
  if (n < 1) {this.slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].hidden=true;
  }
  slides[this.slideIndex-1].hidden=false; 
}

displayBook(idBook: number) {
  //console.log(idBook)
  this.router.navigate(['detailLivre',idBook]);
}

getBookCover(idBook: number) {
  return getURLBookCover(idBook);
}
}
