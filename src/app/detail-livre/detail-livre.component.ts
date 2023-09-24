import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../modele/Book';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private electrolibSrv: ElectrolibService,private route: ActivatedRoute){

  }
  book: Book = new Book();

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBook(id).subscribe(receivedBook =>{
      this.book=receivedBook;
      console.log(this.book);
     });
    }
  }

}
