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
    if (user != undefined && user.roles == '["ROLE_USER"]') {
      return true;
    }
    return false;
  }

  checkAdmin() {
    let user = this.dataService.getUser();
    if (user != undefined && user.roles == '["ROLE_ADMIN"]') {
      return true;
    }
    return false;
  }
}