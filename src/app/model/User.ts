import { Borrow } from "./Borrow";
import { Evaluation } from "./Evaluation";
import { Favorite } from "./Favorite";
import { Reservation } from "./Reservation";

export class User {
  idUser: number = 0;
  memberNumber: string = '';
  email: string = '';
  registrationDate: Date = new Date();
  firstName: string = '';
  lastName: string = '';
  profilePicture:string = '';
  address: string = '';
  phoneNumber: string = '';
  postalCode: string = '';
  roles: string = '["ROLE_USER"]';
  password: string = '';
  fees:number = 0;
  
  // Pour l'affichage des users dans admin
  totalPenalities: number = 0;
  asObservable: any;
  next: any;
  borrows: Borrow[] = new Array();
  evaluations: Evaluation[] = new Array();
  favorites: Favorite[] = new Array();
  reservations: Reservation[] = new Array();
    
  // * In the data base, change the plain password for encryted password
  // Password: '11'  ->  Encrypted: '++cdq/GB/bH/XEbb9RrLrg=='
  // Password: 'admin'  ->  Encrypted: 'SMecCl59g0Q75GIxCgLagQ=='
}