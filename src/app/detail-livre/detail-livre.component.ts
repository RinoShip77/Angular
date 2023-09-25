import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../model/Book';
import { Genre } from '../model/Genre';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private electrolibSrv: ElectrolibService,private route: ActivatedRoute){

  }
  book: Book = new Book();
  //genre: Genre = new Genre();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBook(id).subscribe(receivedBook =>{
      this.book=receivedBook;
      console.log(receivedBook);

      //je mets le code pour aller chercher le genre ici, je pense que subsrcibe fait un bug sinon
      //this.electrolibSrv.getGenre(this.book.idGenre).subscribe(receivedGenre=>{
      //  this.genre=receivedGenre;
     //   console.log(this.genre);
    //  });
     });
    }
  }

}
