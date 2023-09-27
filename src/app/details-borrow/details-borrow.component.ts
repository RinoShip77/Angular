import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { Book } from '../model/Book';
import { Genre } from '../model/Genre';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-borrow',
  templateUrl: './details-borrow.component.html',
  styleUrls: ['./details-borrow.component.css']
})
export class DetailsBorrowComponent {
  constructor(private electrolibSrv: ElectrolibService,private route: ActivatedRoute){ //private route: ActivatedRoute a jouter apres merge

  }
  book: Book = new Book();
  //genre: Genre = new Genre();
  currentDate:Date=new Date();
  returnDate:Date=new Date();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    this.returnDate.setDate(this.currentDate.getDate()+7*2);


    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBook(id).subscribe(receivedBook =>{
      this.book=receivedBook;
      console.log(this.book);

      //je mets le code pour aller chercher le genre ici, je pense que subsrcibe fait un bug sinon
      //this.electrolibSrv.getGenre(this.book.idGenre).subscribe(receivedGenre=>{
        //this.genre=receivedGenre;
        //console.log(this.genre);
      //});
     });
    }
  }
}
