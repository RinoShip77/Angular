import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ENCRYPTION_KEY, MAX_FILE_SIZE, getURLProfilePicture } from '../util';
import { ToastService } from '../toast.service';
import { EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined = new User();
  role: string = '';
  tempUser: any;
  margin: string = '';
  colorSwitch: boolean = false;
  background: string = '';
  selectedImage: any;
  formData = new FormData();
  file: any;
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
      if (this.dataService.getUser() != undefined) {
        this.user = this.dataService.getUser();
      }
    } else {
      this.electrolibService.getUser(id).subscribe(
        user => {
          this.user = user;
        }
      );
      this.margin = 'admin';
    }

    if (this.checkRoles()) {
      this.role = 'Administrateur';
    } else {
      this.role = 'Membre';
    }
    window.theme = 'dark';

    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.url = getURLProfilePicture(this.user?.idUser);
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
  switchBackground() {
    localStorage.setItem('background', this.background);
  }

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  switchTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark')
      window.theme = 'dark';
    } else {
      localStorage.setItem('theme', 'light')
      window.theme = 'light';
    }
  }

  //---------------------------------
  // Function to upload a new profile picture to the user
  //---------------------------------
  updatePicture(idUser: number | undefined, event: any, pictureNumber?: number) {
    this.onFileSelected(event);

    this.electrolibService.uploadProfilePicture(idUser, this.file_data).subscribe(
      response => {
        this.toastService.show('Votre profil a été mis à jour.', {
          classname: 'bg-success',
        });
        this.url = getURLProfilePicture(idUser);
      },
      (error) => {
        this.toastService.show('La mise à jour a échoué.', {
          classname: 'bg-danger',
        });
      }
    );

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
        this.file_data = new Blob([this.selectedImage], { type: this.selectedImage.type });;
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
    let fileSupported = false;

    if (this.selectedImage.size <= MAX_FILE_SIZE) {
      let extension = this.extractExtension(this.selectedImage.name);

      if (extension?.toLowerCase() === 'png' || extension?.toLowerCase() === 'jpg' || extension?.toLowerCase() === 'jpeg') {
        fileSupported = true;
      } else {
        this.toastService.show("L'extension du fichier n'est pas supportée.", {
          classname: 'bg-danger',
        });
      }
    }
    else {
      fileSupported = false;
      this.toastService.show('Le fichier est trop volumineux. Maximum de 500 kB.', {
        classname: 'bg-danger',
      });
    }

    return fileSupported;
  }

  //---------------------------------
  // Open a modal with the given content
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
  // Function to change the user password
  //---------------------------------
  updatePassword(idUser: number | undefined, passwords: any) {
    if (this.user?.password != passwords.activePassword) {
      this.toastService.show('Le mot de passe saisi ne correspond pas à votre mot de passe actuel.', {
        classname: 'bg-danger',
      });
    } else {
      if (passwords.activePassword === passwords.newPassword) {
        this.toastService.show('Le nouveau mot de passe doit être différent de celui que vous utiliser actuellement.', {
          classname: 'bg-danger',
        });
      } else {
        let pattern = /([a-zA-Z]|\d){8,}/;

        if (!pattern.test(passwords.newPassword)) {
          this.toastService.show('Le nouveau mot de passe ne respecte pas les critères.', {
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
  // Function to format the postal code in real time
  //---------------------------------
  formatPostalCode() {
    console.log('format postal code');

    // if (this.user.postalCode.length >= 3) {
    //   this.user.postalCode = this.user.postalCode.slice(0, 3) + ' ' + this.user.postalCode.slice(3);
    // }
  }

  //---------------------------------
  // Function to format the phone number in real time
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
  // Function to update the information of a user
  //---------------------------------
  updateUser(idUser: number | undefined, user: User) {
    this.tempUser = user;

    if (!this.validateForm()) {
      console.log('invalide')
      this.validateFields();
    } else {
      console.log('valide')
      user.postalCode = user.postalCode.split(' ')[0] + user.postalCode.split(' ')[1];
      user.phoneNumber = user.phoneNumber.split('-')[0] + user.phoneNumber.split('-')[1] + user.phoneNumber.split('-')[2];

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
    for (const key in this.validations) {
      if (this.validations[key] === null || this.validations[key] === false) {
        console.log(key);
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
    let pattern = /(\w|\d)+@[a-zA-Z]+\.[a-zA-Z]{2,}/;

    if (pattern.test(this.tempUser.email)) {
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
    let pattern = /[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d/;

    if (pattern.test(this.tempUser.postalCode)) {
      this.validations["postalCode"] = true;
    } else {
      this.validations["postalCode"] = false;
    }
  }

  //-------------------------------------------------------
  // Function to validate the phone number
  //-------------------------------------------------------
  validatePhoneNumber() {
    let pattern = /(\d{3}-){2}\d{4}/;

    if (pattern.test(this.tempUser.phoneNumber)) {
      this.validations["phoneNumber"] = true;
    } else {
      this.validations["phoneNumber"] = false;
    }
  }

  openFeesModal(content: any) {
    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true, });
  }

  dismissModal() {
    this.modalService.dismissAll();
  }
}