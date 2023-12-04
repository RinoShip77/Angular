import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  colorSwitch: boolean = false;
  order:string = "DESC";
  selection:string = "all";

  @Output() switchTheme = new EventEmitter<any>();

  ngOnInit(): void 
  {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

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

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  changeTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark');
      this.switchTheme.emit('dark');
    } else {
      localStorage.setItem('theme', 'light');
      this.switchTheme.emit('light');
    }
  }

  retrieveComments()
  {
    if(this.user)
    {
      this.electrolibService.getComments(this.order).subscribe(
        comments => {
          console.log(comments);
          this.comments = comments.map(c => (Object.assign(new Comment(), c)));
        }
      );
    }
  }
  async retrieveCommentsResolved()
  {
    if(this.user)
    {
      await this.electrolibService.getCommentsResolved(this.order).subscribe(
        comments => {
          console.log(comments);
          this.comments = comments.map(c => (Object.assign(new Comment(), c)));
        }
      );
    }
  }
  async retrieveCommentsNotResolved()
  {
    if(this.user)
    {
      await this.electrolibService.getCommentsNotResolved(this.order).subscribe(
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

  async orderWayBySelect(order: any)
  {
    this.order = order.target.value;
    
    if(this.selection == "all")
    {
      await this.retrieveComments();
    }
    if(this.selection == "resolved")
    {
      await this.retrieveCommentsResolved();
    }
    if(this.selection == "not-resolved")
    {
      await this.retrieveCommentsNotResolved();
    }
  }

  async orderBySelect(event: any)
  {
    let selection = event.target.value;
    this.selection = selection;
    this.comments  = new Array();

    if(selection == "all")
    {
      await this.retrieveComments();
    }
    if(selection == "resolved")
    {
      await this.retrieveCommentsResolved();
    }
    if(selection == "not-resolved")
    {
      await this.retrieveCommentsNotResolved();
    }
    
  }
}
