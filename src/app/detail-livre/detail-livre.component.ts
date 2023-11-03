import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';
import { Author } from '../model/Author';
import { User } from '../model/User';
import { DataService } from '../data.service';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private dataSrv: DataService,private router:Router,private electrolibSrv: ElectrolibService,private route: ActivatedRoute){

  }
  isAvailable=false;
  user: User | undefined = new User();
  book: Book = new Book();
  genre: Genre = new Genre();
  author:Author = new Author();
  btnVisible=true;
  Succes=false;
  failure=false;

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    this.user = this.dataSrv.getUser();

    console.log("Onint detailsBook");
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBook(id).subscribe(receivedBook =>{
      this.book=receivedBook;
     // console.log(receivedBook);

      //je mets le code pour aller chercher le genre ici, je pense que subsrcibe fait un bug sinon
      this.electrolibSrv.getGenre(this.book.idGenre).subscribe(receivedGenre=>{
        this.genre=receivedGenre;
       // console.log(this.genre);
     });

     this.electrolibSrv.getAuthor(this.book.idAuthor).subscribe(receivedAuthor=>{
          this.author=receivedAuthor;
     });
     });

     this.checkBookStatus();
    }
  }

  checkBookStatus(){
    if(this.book){
      if(this.book.status.idStatus==1){
        this.isAvailable=true;
      }
    }
  }

  createBorrow(){
    // if(this.user){
    //   this.electrolibSrv.createBorrow(this.book,this.user).subscribe(
    //     receivedBorrow=>{
    //       console.log(receivedBorrow);
    //       if(receivedBorrow.book==null){
    //        this.failureBorrow();
    //       }
    //       else{
    //         this.succesBorrow();
    //       }
    //     }
    //   )};
  }

   succesBorrow(){
    this.btnVisible=false;
    this.Succes=true;
  }

  failureBorrow(){
    this.btnVisible=false;
    this.failure=true;
  } 

  Acceuil(){
    this.router.navigate(['inventory']);
  }

  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }

  AjoutFav(){
    if(this.user){
      this.electrolibSrv.createFavorite(this.book,this.user).subscribe(
        receivedFavorite=>{
          console.log(receivedFavorite);
          /* if(receivedBorrow.book==null){
           this.failureBorrow();
          }
          else{
            this.succesBorrow();
          } */
        }
      )};
  }

}
