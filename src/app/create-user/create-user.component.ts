import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { EMAIL_REGEX, PHONE_NUMBER_REGEX, POSTAL_CODE_REGEX } from '../util';
import { ElectrolibService } from '../electrolib.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../data.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  user: User = new User();
  validationPassword: string = "";
  userCreated: boolean = false;
  registrationDate: any;

  errors: { [key: string]: string | null } = {
    firstName: null,
    lastName: null,
    email: null,
    address: null,
    postalCode: null,
    phoneNumber: null,
    password: null,
    validationPassword: null
  };

  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private dataService: DataService) {}

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
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

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  onSubmit() {
    this.validateAllFields();
    if (this.validateForm()) {
      this.electrolibService.createUser(this.user).subscribe(
        (response) => {
          console.log('User created successfully!', response);
          this.user = response;
          let date: any = response.registrationDate;
          this.registrationDate = new DatePipe('en-US').transform(new Date(date.date), 'yyyy-MM-dd HH:mm:ss');
          this.userCreated = true;
        },
        (error) => {
          console.error('Creation failed:', error);
        }
      );
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateFirstName() {
    if (this.user.firstName.length <= 0 || this.user.firstName.length > 50) {
      this.errors["firstName"] = "Le prénom doit contenir entre 1 et 50 caractères.";
    } else {
      this.errors["firstName"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateLastName() {
    if (this.user.lastName.length <= 0 || this.user.lastName.length > 50) {
      this.errors["lastName"] = "Le nom doit contenir entre 1 et 50 caractères.";
    } else {
      this.errors["lastName"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateEmail() {
    if (!EMAIL_REGEX.test(this.user.email)) {
      this.errors["email"] = "L'adresse courriel est invalide.";
    } else {
      this.errors["email"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateAddress() {
    if (this.user.address.length <= 0 || this.user.address.length > 100) {
      this.errors["address"] = "L'adresse doit contenir entre 1 et 100 caractères.";
    } else {
      this.errors["address"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validatePostalCode() {
    if (!POSTAL_CODE_REGEX.test(this.user.postalCode.toUpperCase())) {
      this.errors["postalCode"] = "Le code postal est invalide";
    } else {
      this.errors["postalCode"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validatePhoneNumber() {
    if (!PHONE_NUMBER_REGEX.test(this.user.phoneNumber)) {
      this.errors["phoneNumber"] = "Le numéro de téléphone est invalide";
    } else {
      this.errors["phoneNumber"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validatePassword() {
    if (this.user.password.length <= 0 || this.user.password.length > 100) {
      this.errors["password"] = "Le mot de passe est invalide";
    } else {
      this.errors["password"] = null;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateValidationPassword() {
    if (this.validationPassword != this.user.password) {
      this.errors["validationPassword"] = "Les mots de passe sont différents.";
    } else {
      this.errors["validationPassword"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide tous les champs du compte
  //-------------------------------------------------------
  validateAllFields() {
    this.validateFirstName();
    this.validateLastName();
    this.validateEmail();
    this.validateAddress();
    this.validatePostalCode();
    this.validatePhoneNumber();
    this.validatePassword();
    this.validateValidationPassword();
  }

  //-------------------------------------------------------
  // Valide le formulaire du compte
  //-------------------------------------------------------
  validateForm() {
    for (const key in this.errors) {
      if (this.errors.hasOwnProperty(key) && this.errors[key] !== null) {
        return false;
      }
    }
    return true;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }
}

