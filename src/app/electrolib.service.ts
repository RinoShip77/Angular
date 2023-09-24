import { Injectable } from '@angular/core';
import { urlServer } from './utile';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './modele/Book';
import { User } from './modele/User';
import { Genre } from './modele/genre';

@Injectable({
  providedIn: 'root'
})
export class ElectrolibService {
  //--------------------------------
  // Initialize the component
  //--------------------------------
  constructor(private http:HttpClient) { }

  //--------------------------------
  //
  //--------------------------------
  connection(user: User) {
    let url = urlServer + 'connection';

    const params = new HttpParams({
      fromObject: {
        email: user.email,
        password: user.password
      }
    });

    return this.http.post<User>(url, params);
  }

  //--------------------------------
  // Route to get all the books
  //--------------------------------
  getBooks()
  {
    let url = urlServer + 'getBooks';

    return this.http.get<Book[]>(url);
  }
  
  //route qui va chercher un livre
  getBook(id:number){
    let url = urlServer + 'getBook/'+id;

    return this.http.get<Book>(url);
  }

  getGenre(id:number){
    let url = urlServer + 'genre/'+id;
    console.log(url);
    return this.http.get<Genre>(url);
  }
}