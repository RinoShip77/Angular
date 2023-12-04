import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { RouteChangeService } from '../route-change.service';
import { DataService } from '../data.service';
import { NgbTooltipModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../toast.service';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  visible: boolean;
  user: User | undefined = new User();

  //---------------------------------
  // Function to build the component
  //---------------------------------
  constructor(private offcanvasService: NgbOffcanvas, private router: Router, private routeChangeService: RouteChangeService, private dataService: DataService, private toastService: ToastService, private electrolibService:ElectrolibService) {
    this.visible = this.router.url !== "/";
    this.user = this.dataService.getUser();
  }

  //---------------------------------
  // Function to initialize the component
  //---------------------------------
  ngOnInit() {
    this.routeChangeService.routeChange$.subscribe(() => {
      this.updateVisibility();
    });
    
    this.updateVisibility();
  }
  
  //---------------------------------
  // Function to set the UI
  //---------------------------------
  updateVisibility() {
    if (this.dataService.getUser() != undefined) {
      this.user = this.dataService.getUser();
      if (this.router.url !== "/" && this.dataService.getUser()?.roles === '["ROLE_USER"]') {
        this,this.visible = true;
      } else {
        this,this.visible = false;
      }
    } else {
      this.router.navigate([""]);
    }
  }

  //---------------------------------
  // Function to disconnect the user
  //---------------------------------
  disconnect() {
    this.offcanvasService.dismiss();
    this.dataService.disconnectUser();
    this.visible = false;
    this.router.navigate([""]);
  }

  //---------------------------------
  // Function to expand the navbar
  //---------------------------------
  // openOffcanvas(content: any) {
  //   this.offcanvasService.open(content, { position: 'end' });
  // }

  
}