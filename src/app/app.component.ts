import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';
import { DataService } from './data.service';
import { User } from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //---------------------------------
  // Function to disconnect the current user
  //---------------------------------
  constructor(private modalService: NgbModal, public dataService: DataService) { }

  //---------------------------------
  // Function to disconnect the current user
  //---------------------------------
  openChat() {
    this.modalService.open(ChatComponent, {
      animation: true,
      keyboard: true,
      scrollable: true
    });
  }

  checkUser() {
    let user = this.dataService.getUser();
    console.log(user?.roles);
    if (user != undefined && user.roles == '["ROLE_USER"]') {
      console.log("true");
      return true;
    }
    console.log("false");
    return false;
  }
}