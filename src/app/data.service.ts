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

  getUser() {
    return this.user;
  }

  disconnectUser() {
    this.user = undefined;
  }
}
