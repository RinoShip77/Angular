import { Component,ElementRef } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { DataService } from '../data.service';
import { getURLBookCover } from '../util';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent {
  user: any;
 
  constructor(private router:Router,private electrolibSrv: ElectrolibService,private route: ActivatedRoute,private elementRef:ElementRef,private dataSrv: DataService){

  }

  slideIndex:number = 1;
  recommendedBooks: Book[]=[];
  
  book: Book = new Book();
  //genre: Genre = new Genre();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    console.log("recommended works");
    this.user = this.dataSrv.getUser();

    if(this.user.idUser){
     this.electrolibSrv.getRecommended(this.user.idUser).subscribe(receivedBooks =>{
      this.recommendedBooks=receivedBooks.slice(0,10);
      console.log(this.recommendedBooks);
      setTimeout(() =>this.showSlides(this.slideIndex), 200);
      
  })};
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
  console.log(slides);
  if (n > slides.length) {this.slideIndex = 1}
  if (n < 1) {this.slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].hidden=true;
  }
  slides[this.slideIndex-1].hidden=false; 
}

displayBook(idBook: number) {
  console.log(idBook)
  this.router.navigate(['detailLivre',idBook]);
}

getBookCover(idBook: number) {
  return getURLBookCover(idBook);
}
}
