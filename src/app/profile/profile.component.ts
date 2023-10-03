import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined = new User();
  profilePicture: string = '';
  showSuccess: boolean = false;
  successMessage: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  switch: boolean = false;

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
  switchTheme() {
    console.log(this.switch)
    if(this.switch) {
      console.log('dark')
    } else {
      console.log('light')
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
  updatePassword(idUser: number | undefined, passwords: any) {
    if (this.user?.password === passwords.activePassword) {
      if (passwords.activePassword !== passwords.newPassword) {
        if (passwords.newPassword === passwords.confirmationPassword) {
          // passwords.newPassword.hash(); //TODO: Hash the password
          this.electrolibService.updateProfile('updatePassword', idUser, passwords).subscribe(
            user => {
              this.showSuccess = true;
              this.successMessage = 'Votre mot de passe a été mis à jour';
              this.dataService.updatePassword(passwords.newPassword);
            },
            (error) => {
              this.showError = true;
              this.errorMessage = 'La mise à jour a échoué';
            }
          );
        } else {
          this.showError = true;
          this.errorMessage = 'Les nouveaux mot de passe ne correspondent pas';
        }
      } else {
        this.showError = true;
        this.errorMessage = 'Le nouveau mot de passe doit être différent de celui que vous utiliser actuellement';
      }
    } else {
      this.showError = true;
      this.errorMessage = 'Le mot de passe saisi ne correspond pas à votre mot de passe actuelle';
    }
  }

  //---------------------------------
  // Function to close the profile
  //---------------------------------
  closeProfile(idUser: number | undefined, password: string) {
    if (this.user?.password === password) {
      this.electrolibService.updateProfile('deactivateAccount', idUser).subscribe(
        user => {
          this.showSuccess = true;
          this.successMessage = 'Votre profil a été fermé';
          setTimeout(() => { this.router.navigate([""]); }, 2000);
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'La fermeture du compte a échoué';
        }
      );
    } else {
      this.showError = true;
      this.errorMessage = 'Le mot de passe est incorrecte';
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
          this.showSuccess = true;
          this.successMessage = 'Votre profil a été mis à jour';
          this.dataService.updateUser(user);
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'La mise à jour a échoué';
        }
      );

      //console.log(this.profilePicture);
    }
  }
}