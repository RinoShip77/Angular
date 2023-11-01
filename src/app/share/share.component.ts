import { Component, OnInit } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { User } from '../model/User';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit 
{
  user: User | undefined = new User();
  description:string = "";
  reason:string = "";

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
  }

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService) { }

  send()
  {
    //appel de symfony
    //création objet feedback
    //envois courriel si possible
    //création table en admin
  }

  validateContent()
  {
    if(this.reason == "" || this.description == "")
    {
      return false;
    }
    else
    {
      this.send();
      return true;
    }
  }

  openSendModal(content:any)
  {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', animation:true, });
  }
}
