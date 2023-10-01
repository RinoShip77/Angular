import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from '../app/model/User';
//import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService{

  isLoggedIn: boolean = false;
  user: User | undefined = new User();

  constructor(private dataSrv: DataService) { }

  isUserLoggedIn(){
    this.user = this.dataSrv.getUser();
    if(this.user){
        return true;
    }
    return false;
  }
  
}
