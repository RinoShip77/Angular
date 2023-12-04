import { Injectable } from '@angular/core';
import { User } from './model/User';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private user: User | undefined;
  private isFromBorrow: boolean = false;
  private tabChangeSubject = new Subject<string>();

  tabChange$ = this.tabChangeSubject.asObservable();

  constructor() { }

  updateUser(user: User) {
    this.user = user;
  }

  updatePassword(password: string) {
    if (this.user) {
      this.user.password = password;
    }
  }

  getUser() {
    return this.user;
  }

  disconnectUser() {
    this.user = undefined;
  }

  getIsFromBorrow(){
    return this.isFromBorrow;
  }

  setIsFromBorrowTrue(){
    this.isFromBorrow=true;
  }

  setIsFromBorrowFalse(){
    this.isFromBorrow=false;
  }

  changeTab(tab: string) {
    this.tabChangeSubject.next(tab);
  }
}
