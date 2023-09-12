import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './modele/Book';
import { User } from './modele/User';

@Injectable({
  providedIn: 'root'
})
export class ElectrolibService {

  //--------------------------------
  // Initialize the component
  //--------------------------------
  constructor(private http:HttpClient) { }

  //--------------------------------
  // Route to get all the books
  //--------------------------------
  getBooks()
  {
    let url = urlServer + 'books';
    return this.http.get<Book[]>(url);
  }

  //--------------------------------
  //
  //--------------------------------
  connection(user: User) {
    let url = urlServer + 'users/connection';

    const params = new HttpParams({
      fromObject: {
        email: user.email,
        password: user.password
      }
    });

    return this.http.post<User>(url, params);
  }
}