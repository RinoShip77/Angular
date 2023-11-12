import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { Comment } from '../model/Comment';
import { ElectrolibService } from '../electrolib.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-share',
  templateUrl: './admin-share.component.html',
  styleUrls: ['./admin-share.component.css']
})
export class AdminShareComponent  implements OnInit 
{
  user:User | undefined = new User();

  theme = "";

  comments: Comment[] = new Array();

  ngOnInit(): void 
  {
    this.user = this.datasrv.getUser();
    this.retrieveComments();

    if(localStorage.getItem('theme') != "light")
    {
      this.theme = "dark";
    }
    else
    {
      this.theme = "";
    }
  }

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private datasrv: DataService) {}

  retrieveComments()
  {
    if(this.user)
    {
      this.electrolibService.getComments().subscribe(
        comments => {
          console.log(comments);
          this.comments = comments.map(c => (Object.assign(new Comment(), c)));
        }
      );
    }
  }

  async declareFixed(comment:Comment)
  {
    if(this.user)
    {
      await this.electrolibService.commentsFixed(comment).subscribe();
    }

    await this.retrieveComments();
  }
}
