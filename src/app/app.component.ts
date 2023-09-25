import { Component, Input } from '@angular/core';
import { User } from './model/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isConnected = false;
  isChatting = false;
  user: User = new User();
  title: any;

  constructor(private modalService: NgbModal) {}

  //---------------------------------
  // Function to connect a user
  //---------------------------------
  onConnect(user: User) {
    this.isConnected = true;
    this.user = user;
  }

  openChat() {
    this.modalService.open(ChatComponent, {
      animation: true,
      keyboard: true,
      scrollable: true
    });
  }

  //---------------------------------
  // Function to disconnect the current user
  //---------------------------------
  onDisconnect(user: User) {
    this.isConnected = false;
    console.log('disconnect user: ' + user.memberNumber);
    user = new User();
  }
}