import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';
import { DataService } from './data.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  theme: string | null = 'light';

  //---------------------------------
  // Function to disconnect the current user
  //---------------------------------
  constructor(private modalService: NgbModal, public dataService: DataService, private toastService: ToastService) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    this.theme = localStorage.getItem('theme');
  }

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

  getStyles() {
    return {
      'margin-top': '5em',
      'margin-left': '5em'
    };
  }
}