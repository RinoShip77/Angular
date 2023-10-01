import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined = new User();
  profilePicture = '';
  password = {
    oldPassword: '',
    newPassword: '',
    confirmationNewPassword: ''
  }

  @Output() openInventory = new EventEmitter<User>();
  @Output() openBorrow = new EventEmitter<User>();
  @Output() openFavorite = new EventEmitter<User>();
  @Output() disconnected = new EventEmitter<User>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolib: ElectrolibService, private modalService: NgbModal, private dataService: DataService, private router: Router) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    if (this.dataService.getUser() != undefined) {
      this.user = this.dataService.getUser();
    }
    console.log(this.user);
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/users/default-user.png';
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  uploadImage() {
    console.log('new profile picture');
  }

  //---------------------------------
  // Open the modal to update the user password
  //---------------------------------
  openModal(content: any) {
    this.modalService.open(content, {
      animation: true,
      centered: true,
      keyboard: true,
      size: 'lg'
    });
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  updatePassword() {
    console.log('update password ...\n');
    console.log(this.password);
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  formatPostalCode() {
    // if (this.user.postalCode.length >= 3) {
    //   this.user.postalCode = this.user.postalCode.slice(0, 3) + ' ' + this.user.postalCode.slice(3);
    // }
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  formatPhoneNumber() {
    console.log('change phone number');

    // if(this.user.phoneNumber.length == 3) {
    //   this.user.phoneNumber = this.user.phoneNumber.slice(0, 3) + '-' + this.user.phoneNumber.slice(3);
    // }

    // if(this.user.phoneNumber.length == 7) {
    //   this.user.phoneNumber = this.user.phoneNumber.slice(3, 7) + '-' + this.user.phoneNumber.slice(7);
    // }
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  updateProfile(user: User) {    
    console.log(user);
    console.log(this.profilePicture);
  }
}