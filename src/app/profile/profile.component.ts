import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMAIL_REGEX, ENCRYPTION_KEY, MAX_FILE_SIZE, PHONE_NUMBER_REGEX, POSTAL_CODE_REGEX, getURLBookCover, getURLProfilePicture } from '../util';
import { ToastService } from '../toast.service';
import { EncryptionService } from '../encryption.service';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined = new User();
  borrows: Borrow[] = new Array();
  role: string = '';
  tempUser: any;
  margin: string = '';
  colorSwitch: boolean = false;
  background: string | null = '';
  selectedImage: any;
  file_data: any = "";
  url: string = '';
  disconnected: boolean = false;
  validations: { [key: string]: boolean | null | undefined } = {
    email: null,
    firstName: null,
    lastName: null,
    address: null,
    postalCode: null,
    phoneNumber: null
  };

  @Output() switchTheme = new EventEmitter<any>();

  //---------------------------------
  // Function to build the component
  //---------------------------------
  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private dataService: DataService, private router: Router, private toastService: ToastService, private Encryption: EncryptionService, private route: ActivatedRoute) { }

  //---------------------------------
  // Function to initialize the component
  //---------------------------------
  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.user = this.dataService.getUser();
    } else {
      this.electrolibService.getUser(id).subscribe(
        user => {
          this.user = user;
          this.electrolibService.getBorrowsFromUser(user).subscribe(
            borrows => {
              this.borrows = borrows;
            }
          );
        }
      );
      this.margin = 'admin';
    }

    if (this.checkRoles()) {
      this.role = 'Administrateur';
    } else {
      this.role = 'Membre';
    }

    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveBorrows();
    this.background = sessionStorage.getItem('background');
    this.url = getURLProfilePicture(this.user?.idUser, this.user?.profilePicture);
  }

  //---------------------------------
  // Function to get the recent borrows of the user
  //---------------------------------
  retrieveBorrows() {
    if (this.user != undefined) {
      this.electrolibService.getBorrowsFromUser(this.user).subscribe(
        borrows => {
          this.borrows = borrows;
        }
      );
    }
  }

  //---------------------------------
  // Function to verify the role of the user
  //---------------------------------
  checkRoles() {
    if (this.user != undefined && this.user?.roles.includes('ROLE_ADMIN')) {
      return true;
    }
    return false;
  }

  //---------------------------------
  // Function to change the background of the page
  //---------------------------------
  changeBackground() {
    if (this.background != null) {
      sessionStorage.setItem('background', this.background);
    }
  }

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  changeTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark');
      this.switchTheme.emit('dark');
    } else {
      localStorage.setItem('theme', 'light');
      this.switchTheme.emit('light');
    }
  }

  //---------------------------------
  // Function to upload a new profile picture to the user
  //---------------------------------
  updatePicture(idUser: number | undefined, event: any, pictureNumber?: number) {
    this.onFileSelected(event);

    if (this.file_data != '') {
      let timestamp = Date.now();

      this.electrolibService.uploadProfilePicture(idUser, timestamp, this.file_data).subscribe(
        response => {
          console.log(response);
          this.toastService.show('Votre profil a été mis à jour.', {
            classname: 'bg-success',
          });
          this.url = getURLProfilePicture(idUser, '', timestamp);
        },
        (error) => {
          this.toastService.show('La mise à jour a échoué.', {
            classname: 'bg-danger',
          });
        }
      );
    }

    // this.electrolibService.updateUser('updatePicture', idUser, { pictureNumber: pictureNumber }).subscribe(
    //   user => {
    //     this.toastService.show('Votre profil a été mis à jour.', {
    //       classname: 'bg-success',
    //     });
    //     this.url = 'assets/images/users/profilePictures/Picture' + pictureNumber + '.png';
    //   },
    //   (error) => {
    //     this.toastService.show('La mise à jour a échoué.', {
    //       classname: 'bg-danger',
    //     });
    //   }
    // );
  }

  //-------------------------------------------------------
  // Upload an image
  //-------------------------------------------------------
  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.selectedImage = fileList[0];

      if (this.validateFile()) {
        this.file_data = new Blob([this.selectedImage], { type: this.selectedImage.type });
      }
    }
  }

  //-------------------------------------------------------
  // Return the extension of the image
  //-------------------------------------------------------
  extractExtension(fileName: string) {
    let extension = fileName.split('.').pop();
    return extension;
  }

  //-------------------------------------------------------
  // Validate the image before sending it to the DB
  //-------------------------------------------------------
  validateFile() {
    if (this.selectedImage.size <= MAX_FILE_SIZE) {
      let extension = this.extractExtension(this.selectedImage.name);

      if (extension?.toLowerCase() !== 'png') {
        this.toastService.show("L'extension du fichier n'est pas supportée.", {
          classname: 'bg-danger',
        });
        return false;
      }
    }
    else {
      this.toastService.show('Le fichier est trop volumineux. Maximum de 500 kB.', {
        classname: 'bg-danger',
      });
      return false;
    }

    return true;
  }

  //---------------------------------
  // Open a modal with the given content
  //---------------------------------
  openModal(content: any, size?: string) {
    if (!size) {
      size = 'lg';
    }

    this.modalService.open(content, {
      animation: true,
      centered: true,
      keyboard: true,
      size: size
    });
  }

  //---------------------------------
  // Function to change the user password
  //---------------------------------
  updatePassword(idUser: number | undefined, passwords: any) {
    if (this.user?.password != passwords.activePassword) {
      this.toastService.show('Le mot de passe saisi ne correspond pas à votre mot de passe actuel.', {
        classname: 'bg-danger',
      });
    } else {
      if (passwords.newPassword.length === 0) {
        this.toastService.show('Votre nouveaux mot de passe ne doit pas être vide.', {
          classname: 'bg-danger',
        });
      } else {
        if (passwords.activePassword === passwords.newPassword) {
          this.toastService.show('Le nouveau mot de passe doit être différent de celui que vous utiliser actuellement.', {
            classname: 'bg-danger',
          });
        } else {
          if (passwords.newPassword !== passwords.confirmationPassword) {
            this.toastService.show('Les nouveaux mot de passe ne correspondent pas.', {
              classname: 'bg-danger',
            });
          } else {
            // * Encrypte the password
            // * De-comment this line to encrypte
            //let encrypted = this.Encryption.set(ENCRYPTION_KEY, passwords.newPassword);

            // * De-comment this line to encrypte and erase the next line
            //this.electrolibService.updateUser('updatePassword', idUser, { newPassword: encrypted }).subscribe(
            this.electrolibService.updateUser('updatePassword', idUser, passwords).subscribe(
              user => {
                this.toastService.show('Votre mot de passe a été mis à jour.', {
                  classname: 'bg-success',
                });
                this.dataService.updatePassword(passwords.newPassword);
              },
              (error) => {
                this.toastService.show('La mise à jour a échoué.', {
                  classname: 'bg-danger',
                });
              }
            );
          }
        }
      }
    }
  }

  //---------------------------------
  // Function to modify the role of the profile
  //---------------------------------
  modifyRole(action: string, idUser: number | undefined, password: string) {
    if (this.user?.password === password) {
      switch (action) {
        case 'open':
          this.electrolibService.updateUser('activateAccount', idUser).subscribe(
            user => {
              this.toastService.show('Votre profil est maintenent ouvert.', {
                classname: 'bg-success',
              });
              this.disconnected = true; // Necessary
            },
            (error) => {
              this.toastService.show("L'ouverture du compte a échoué.", {
                classname: 'bg-danger',
              });
            }
          );
          break;

        case 'close':
          this.electrolibService.updateUser('deactivateAccount', idUser).subscribe(
            user => {
              this.toastService.show('Votre profil a été fermé.', {
                classname: 'bg-success',
              });
              this.disconnected = true; // Necessary
            },
            (error) => {
              this.toastService.show('La fermeture du compte a échoué.', {
                classname: 'bg-danger',
              });
            }
          );
          break;
      }

    } else {
      this.toastService.show('Le mot de passe est incorrecte.', {
        classname: 'bg-danger',
      });
    }
  }

  //---------------------------------
  // Function to update the information of a user
  //---------------------------------
  updateUser(idUser: number | undefined, user: User) {
    this.tempUser = user;

    if (this.validateForm()) {
      this.electrolibService.updateUser('updateInformations', idUser, user).subscribe(
        user => {
          this.toastService.show('Votre profil a été mis à jour.', {
            classname: 'bg-success',
          });
        },
        (error) => {
          this.toastService.show('Votre profil a été mis à jour.', {
            classname: 'bg-success',
          });
        }
      );
    }
  }

  //---------------------------------
  // Function to validate the form to update the profile
  //---------------------------------
  validateForm() {
    this.validateFields();

    for (const key in this.validations) {
      if (this.validations[key] === null || this.validations[key] === false) {
        return false;
      }
    }
    return true;
  }

  //-------------------------------------------------------
  // Function to validate the fields of the form
  //-------------------------------------------------------
  validateFields() {
    this.validateEmail();
    this.validateFirstName();
    this.validateLastName();
    this.validateAddress();
    this.validatePostalCode();
    this.validatePhoneNumber();
  }

  //-------------------------------------------------------
  // Function to validate the email
  //-------------------------------------------------------
  validateEmail() {
    if (EMAIL_REGEX.test(this.tempUser.email)) {
      this.validations["email"] = true;
    } else {
      this.validations["email"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the first name
  //-------------------------------------------------------
  validateFirstName() {
    let pattern = /[a-zA-Z]+/;

    if (pattern.test(this.tempUser.firstName)) {
      this.validations["firstName"] = true;
    } else {
      this.validations["firstName"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the last name
  //-------------------------------------------------------
  validateLastName() {
    let pattern = /[a-zA-Z]+/;

    if (pattern.test(this.tempUser.lastName)) {
      this.validations["lastName"] = true;
    } else {
      this.validations["lastName"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the address
  //-------------------------------------------------------
  validateAddress() {
    if (this.tempUser.address.length > 0) {
      this.validations["address"] = true;
    } else {
      this.validations["address"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the postal code
  //-------------------------------------------------------
  validatePostalCode() {
    if (POSTAL_CODE_REGEX.test(this.tempUser.postalCode)) {
      this.validations["postalCode"] = true;
    } else {
      this.validations["postalCode"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the phone number
  //-------------------------------------------------------
  validatePhoneNumber() {
    if (PHONE_NUMBER_REGEX.test(this.tempUser.phoneNumber)) {
      this.validations["phoneNumber"] = true;
    } else {
      this.validations["phoneNumber"] = false;
    }
  }

  //---------------------------------
  // Function to close all the modal that where previously open
  //---------------------------------
  dismissModal() {
    this.modalService.dismissAll();
  }

  //---------------------------------
  // Function to retrieve the image of a book
  //---------------------------------
  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }
}