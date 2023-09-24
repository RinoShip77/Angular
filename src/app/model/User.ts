export class User {
  idUser: number = 0;
  memberNumber: string = '';
  password: string = '';
  email: string = '';
  registrationDate:string = '';
  firstName: string = '';
  lastName: string = '';
  profilePicture:string = '';
  address: string = '';
  phoneNumber: string = '';
  postalCode: string = '';
  roles: string = '';

  constructor() {
    if (this.roles == '["ROLES_USER"]') {
      this.roles = '[]';
    } else {
      this.roles = '["ROLE_ADMIN"]';
    }
  }
}