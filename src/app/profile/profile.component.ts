import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MAX_FILE_SIZE, getURLProfilePicture } from '../util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined = new User();
  selectedImage: any;
  formData = new FormData();
  file: any;
  file_data: any = "";
  show: any = {
    type: '',
    showToast: false,
    message: ''
  };
  switch: boolean = false;
  url: string = '';

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
      this.url = getURLProfilePicture(this.user?.idUser);
    }
  }

  //---------------------------------
  // Function to open the page for a specific book
  //---------------------------------
  switchTheme() {
    if (this.switch) {
      console.log('dark')
    } else {
      console.log('light')
    }
    localStorage.setItem('theme', '' );
  }

  //---------------------------------
  // Function to upload a new profile picture to the user
  //---------------------------------
  updateProfilePicture(idUser: number | undefined) {
    this.electrolibService.uploadProfilePicture(idUser, this.file_data).subscribe(
      user => {
        this.show.type = 'Succès';
        this.show.showToast = true;
        this.show.message = 'Votre profil a été mis à jour';
        this.url = getURLProfilePicture(idUser);
        
      },
      (error) => {
        this.show.type = 'Erreur';
        this.show.showToast = true;
        this.show.message = 'La mise à jour a échoué';
      }
    );
  }

  //-------------------------------------------------------
  // Upload an image
  //-------------------------------------------------------
  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.selectedImage = fileList[0];

      if (this.validateFile()) {
        this.file_data = new Blob([this.selectedImage], { type: this.selectedImage.type });;
      }
    }
  }

  //-------------------------------------------------------
  // Retourne l'extension de l'image
  //-------------------------------------------------------
  extractExtension(nomFichier: string) {
    let extension = nomFichier.split('.').pop();
    return extension;
  }

  //-------------------------------------------------------
  // Validate the image before sending it to the DB
  //-------------------------------------------------------
  validateFile() {
    let fileSupported = false;
    if (this.selectedImage.size <= MAX_FILE_SIZE) {
      let extension = this.extractExtension(this.selectedImage.name);
      if (extension?.toLowerCase() === 'png') {
        fileSupported = true;
      }
      if (!fileSupported)
        console.log("Erreur: extension de fichier non-supportée", true)
    }
    else {
      fileSupported = false;
      console.log("Erreur: Fichier trop volumineux. Maximum 500 kB et le fichier a " + (this.selectedImage.size / 1024).toFixed(0) + " kB", true, true)
    }

    return fileSupported;
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
              this.show.type = 'Succès';
              this.show.showToast = true;
              this.show.message = 'Votre mot de passe a été mis à jour';
              this.dataService.updatePassword(passwords.newPassword);
            },
            (error) => {
              this.show.type = 'Erreur';
              this.show.showToast = true;
              this.show.message = 'La mise à jour a échoué';
            }
          );
        } else {
          this.show.type = 'Erreur';
          this.show.showToast = true;
          this.show.message = 'Les nouveaux mot de passe ne correspondent pas';
        }
      } else {
        this.show.type = 'Erreur';
        this.show.showToast = true;
        this.show.message = 'Le nouveau mot de passe doit être différent de celui que vous utiliser actuellement';
      }
    } else {
      this.show.type = 'Erreur';
      this.show.showToast = true;
      this.show.message = 'Le mot de passe saisi ne correspond pas à votre mot de passe actuelle';
    }
  }

  //---------------------------------
  // Function to close the profile
  //---------------------------------
  closeProfile(idUser: number | undefined, password: string) {
    if (this.user?.password === password) {
      this.electrolibService.updateProfile('deactivateAccount', idUser).subscribe(
        user => {
          this.show.type = 'Succès';
          this.show.showToast = true;
          this.show.message = 'Votre profil a été fermé';
          setTimeout(() => { this.router.navigate([""]); }, 2000);
        },
        (error) => {
          this.show.type = 'Erreur';
          this.show.showToast = true;
          this.show.message = 'La fermeture du compte a échoué';
        }
      );
    } else {
      this.show.type = 'Erreur';
      this.show.showToast = true;
      this.show.message = 'Le mot de passe est incorrecte';
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
          this.show.type = 'Succès';
          this.show.showToast = true;
          this.show.message = 'Votre profil a été mis à jour';
          this.dataService.updateUser(user);
        },
        (error) => {
          this.show.type = 'Erreur';
          this.show.showToast = true;
          this.show.message = 'La mise à jour a échoué';
        }
      );
    }
  }
}