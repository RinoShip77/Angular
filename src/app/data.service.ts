import { Injectable } from '@angular/core';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private user: User | undefined;

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
}
