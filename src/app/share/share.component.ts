import { Component, OnInit } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { User } from '../model/User';
import { Comment } from '../model/Comment';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  user: User | undefined = new User();
  description: string = "";
  reason: string = "";

  theme = "";

  comment: Comment = new Comment();

  sent:boolean = false;

  ngOnInit(): void {
    this.user = this.datasrv.getUser();

    if (localStorage.getItem('theme') != "light") {
      this.theme = "dark";
    }
    else {
      this.theme = "";
    }
  }

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService) { }

  send() {
    this.comment.reason = this.reason;
    this.comment.content = this.description;
    this.comment.isFixed = 0;

    if(this.user)
    {
      this.electrolibService.createComment(this.comment, this.user).subscribe(
        createdComment => {
          console.log('Commentaire créé!', createdComment);

          

          
        },
        (error) => {
          console.error('Création erreur', error);
        }
      );
    }
  

  }

  validateContent() 
  {
    if (this.reason == "" || this.description == "") 
    {
      return false;
    }
    else 
    {
      return true;
    }
  }
  

  openSendModal(content: any) {
    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', animation: true, });

    if (this.reason != "" && this.description != "") 
    {
      this.send();
    }
  }

  closedModal()
  {
    this.reason = "";
    this.description = "";
  }
}
