import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../modele/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  visible = false;
  profilePicture = '';
  user: User = new User();
  password = {
    oldPassword: '',
    newPassword: '',
    confirmationNewPassword: ''
  }

  @Output() disconnected = new EventEmitter<User>();

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolib: ElectrolibService, private modalService: NgbModal) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onProfile(user: User) {
    this.visible = true;
    this.user = user;

    console.log(user);
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  uploadImage() {
    console.log('new profile picture');
  }

  //---------------------------------
  // Open the inventory of this user
  //---------------------------------
  openInventory() {
    console.log('open inventory');
  }

  //---------------------------------
  // Open the borrow(s) mades by the user
  //---------------------------------
  openBorrows() {
    console.log('open borrows');
  }

  //---------------------------------
  // Open the favorites of the user
  //---------------------------------
  openFavorites() {
    console.log('open favorites');
  }

  //---------------------------------
  // Open the modal to update the user password
  //---------------------------------
  open(content: any) {
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
    console.log('change postal code');

    if (this.user.postalCode.length >= 3) {
      this.user.postalCode = this.user.postalCode.slice(0, 3) + ' ' + this.user.postalCode.slice(3);
    }
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
  updateProfile() {
    console.log('update profile ...\n');
    console.log(this.user);
    console.log(this.profilePicture);
  }

  //---------------------------------
  // Function to disconnect a user
  //---------------------------------
  disconnect() {
    this.visible = false;
    this.disconnected.emit(this.user);
  }
}