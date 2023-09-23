import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './model/Book';
import { User } from './model/User';
import { Genre } from './model/Genre';
import { Author } from './model/Author';

@Injectable({
  providedIn: 'root'
})
export class ElectrolibService {

  //--------------------------------
  // Initialize the component
  //--------------------------------
  constructor(private http: HttpClient) { }

  
  //--------------------------------
  // Route to get all the books
  //--------------------------------
  getBooks(filter?: number[], search?: string) {
    let url = urlServer + 'books';
    
    if (filter && search) {
      url += '?idGenre=';
      
      for (let i = 0; i < filter.length; i++) {
        url += + filter[i] + ',';
      }
      
      url = url.slice(0, -1);
      url += '&search=' + search;
    }

    if (filter && !search) {
      url += '?idGenre=';
      
      for (let i = 0; i < filter.length; i++) {
        url += + filter[i] + ',';
      }
      
      url = url.slice(0, -1);
    }

    if (!filter && search) {
      url += '?search=' + search;
    }
    
    return this.http.get<Book[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getAuthors() {
    let url = urlServer + 'authors';

    return this.http.get<Author[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getAuthor(idAuthor: number) {
    let url = urlServer + 'author/' + idAuthor;

    return this.http.get<Author>(url);
  }

  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getGenres() {
    let url = urlServer + 'genres';

    return this.http.get<Genre[]>(url);
  }

  //--------------------------------
  // Route to connect a user
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