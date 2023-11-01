import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Book } from '../model/Book';
import { Genre } from '../model/Genre';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { User } from '../model/User';
import { getURLBookCover } from '../util';

@Component({
  selector: 'app-details-borrow',
  templateUrl: './details-borrow.component.html',
  styleUrls: ['./details-borrow.component.css']
})
export class DetailsBorrowComponent {
  constructor(private electrolibSrv: ElectrolibService,private dataSrv: DataService,private route: ActivatedRoute,private router:Router){ //private route: ActivatedRoute a jouter apres merge

  }
  isReturn:boolean=false;
  book: Book = new Book();
  user: User | undefined = new User();
  btnVisible=true;
  Succes=false;
  failure=false;
  //genre: Genre = new Genre();
  currentDate:Date=new Date();
  returnDate:Date=new Date();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    this.returnDate.setDate(this.currentDate.getDate()+7*1);
    this.user = this.dataSrv.getUser();


    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBook(id).subscribe(receivedBook =>{
      this.book=receivedBook;
      if(this.book.idStatus==2){
        this.failureBorrow();
      }

      //je mets le code pour aller chercher le genre ici, je pense que subsrcibe fait un bug sinon
      //this.electrolibSrv.getGenre(this.book.idGenre).subscribe(receivedGenre=>{
        //this.genre=receivedGenre;
        //console.log(this.genre);
      //});
     });
    }
  }

  createBorrow(){
    /*if(this.user){
      this.electrolibSrv.createBorrow(this.book,this.user).subscribe(
        receivedBorrow=>{
          console.log(receivedBorrow);
          if(receivedBorrow.book==null){
            this.failureBorrow();
          }
          else{
            this.succesBorrow();
          }
        }
      )};*/
    
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
}
