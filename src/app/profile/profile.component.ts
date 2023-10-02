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
  profilePicture: string = '';

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private dataService: DataService, private router: Router) { }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  ngOnInit() {
    if (this.dataService.getUser() != undefined) {
      this.user = this.dataService.getUser();
    }
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
  openPasswordModal(passwordContent: any) {
    this.modalService.open(passwordContent, {
      animation: true,
      centered: true,
      keyboard: true,
      size: 'lg'
    });
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  updatePassword(idUser: number | undefined, passwords: any) {
    if (this.user?.password === passwords.activePassword) {
      if (passwords.activePassword !== passwords.newPassword) {
        if (passwords.newPassword === passwords.confirmationPassword) {
          // passwords.newPassword.hash(); //TODO: Hash the password
          this.electrolibService.updateProfile('updatePassword', idUser, passwords).subscribe(
            user => {
              console.log('Votre mot de passe a été mis à jour'); //TODO: Inform the user via the UI (NOT the console)
            },
            (error) => {
              console.error('La mise à jour a échoué :', error); //TODO: Inform the user via the UI (NOT the console)
            }
          );
        } else {
          console.error('Les nouveaux mot de passe ne correspondent pas'); //TODO: Inform the user via the UI (NOT the console)
        }
      } else {
        console.error('Le nouveau mot de passe doit être différent de celui que vous utiliser actuellement'); //TODO: Inform the user via the UI (NOT the console)
      }
    } else {
      console.error('Le mot de passe saisi ne correspond pas à votre mot de passe actuelle'); //TODO: Inform the user via the UI (NOT the console)
    }
  }

  //---------------------------------
  // Open the modal to delete the user
  //---------------------------------
  openDeleteModal(deleteContent: any) {
    this.modalService.open(deleteContent, {
      animation: true,
      centered: true,
      keyboard: true,
      size: 'lg'
    });
  }

  //---------------------------------
  // Function to delete thu user
  //---------------------------------
  deleteProfile(idUser: number | undefined, password: string) {
    if (this.user?.password === password) {
      this.electrolibService.deleteProfile('deleteAcount', idUser).subscribe(
        user => {
          console.log('Votre profil a été supprimé'); //TODO: Inform the user via the UI (NOT the console)
          this.router.navigate([""]);
        },
        (error) => {
          console.error('La suppression a échoué :', error); //TODO: Inform the user via the UI (NOT the console)
        }
      );
    } else{
      console.error('Le mot de passe est incorrecte'); //TODO: Inform the user via the UI (NOT the console)
    }
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  formatPostalCode() {
    console.log('format postal code');

    // if (this.user.postalCode.length >= 3) {
    //   this.user.postalCode = this.user.postalCode.slice(0, 3) + ' ' + this.user.postalCode.slice(3);
    // }
  }

  //---------------------------------
  // Function to upload a new profile picture
  //---------------------------------
  formatPhoneNumber() {
    console.log('format phone number');

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
  updateProfile(idUser: number | undefined, user: User) {
    if ((user.email.length != 0) && (user.firstName.length != 0) && (user.lastName.length != 0) && (user.address.length != 0) && (user.postalCode.length != 0) && (user.phoneNumber.length != 0)) {
      this.electrolibService.updateProfile('updateInformations', idUser, user).subscribe(
        user => {
          console.log('Votre profil a été mis à jour'); //TODO: Inform the user via the UI (NOT the console)
        },
        (error) => {
          console.error('La mise à jour a échoué :', error); //TODO: Inform the user via the UI (NOT the console)
        }
      );

      //console.log(this.profilePicture);
    }
  }
}