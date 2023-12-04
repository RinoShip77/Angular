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
  theme: string | null = '';

  //---------------------------------
  // Function to disconnect the current user
  //---------------------------------
  constructor(private modalService: NgbModal, public dataService: DataService, private toastService: ToastService) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    if(localStorage.getItem('theme') !== null) {
      this.theme = localStorage.getItem('theme');
    } else {
      localStorage.setItem('theme', 'light');
    };
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

  isConnected() {
    let user = this.dataService.getUser();
    if (this.dataService.getUser() != undefined) {
      return true;
    }
    return false;
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
      'margin-top': '4.55em',
      'margin-left': '4.65em'
    };
  }

  switchTheme(componentRef: any) {
    componentRef.switchTheme.subscribe((theme: any) => {
      this.theme = theme;
    });
  }
}