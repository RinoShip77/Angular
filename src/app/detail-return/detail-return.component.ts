import { Component } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-return',
  templateUrl: './detail-return.component.html',
  styleUrls: ['./detail-return.component.css']
})
export class DetailReturnComponent {
  visible = false;
  borrow: Borrow = new Borrow();
  user: User | undefined = new User();
  constructor(private electrolibSrv: ElectrolibService,private dataSrv: DataService,private route: ActivatedRoute){ //private route: ActivatedRoute a jouter apres merge

  }



  ngOnInit() {
    this.user = this.dataSrv.getUser();
    console.log("oninit validBorrow");

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
     this.electrolibSrv.getBorrow(id).subscribe(receivedBorrow =>{
      this.borrow=receivedBorrow;
      console.log(this.borrow);
     });

     if(this.borrow){
      this.electrolibSrv.returnBorrow(this.borrow).subscribe(updatedBorrow=>{
        this.borrow=updatedBorrow;
      });
     }
  }
}

  //Lorsqu'on appele et ouvre ce commentaire
  onBorrowDetails(data:any)
  {

    console.log("détails de l'emprunt 2")
    this.borrow = data.selectedBorrow;
    this.user = data.user;
    this.visible = true;
  }

  //Retourne à la page de tous les emprunts
  borrows()
  {
    this.visible = false;
  }
}
