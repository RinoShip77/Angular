import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-livre',
  templateUrl: './detail-livre.component.html',
  styleUrls: ['./detail-livre.component.css']
})
export class DetailLivreComponent {
  constructor(private electrolibSrv: ElectrolibService,private route: ActivatedRoute){

  }

  //au lancement de la page on vachercher les parametres (ici id), dans la lamda qui contient les params on lance la recherche dans la bd avec le service
  ngOnInit() {
    this.route.paramMap.subscribe(params =>{
      if(params.get('id')){
        let id = params.get('id');
        this.electrolibSrv.getBook(parseInt(id)).subscribe(
          tabBook => {
            console.log(tabBook);
          });
      }
      
    });
    }


}
