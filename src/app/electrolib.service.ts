import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './model/Book';
import { User } from './model/User';
import { Genre } from './model/Genre';
import { Author } from './model/Author';
import { Borrow } from './model/Borrow';

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
  getBooks(genresFilter?: number[], authorsFilter?: number[], search?: string) {
    let url = urlServer + 'books';

    if (genresFilter && search) {
      url += '?idGenre=';
      
      for (let i = 0; i < genresFilter.length; i++) {
        url += + genresFilter[i] + ',';
      }
      
      url = url.slice(0, -1);
      url += '&search=' + search;
    }

    if (genresFilter && !search) {
      url += '?idGenre=';
      
      for (let i = 0; i < genresFilter.length; i++) {
        url += + genresFilter[i] + ',';
      }
      
      url = url.slice(0, -1);
    }

    if (!genresFilter && search) {
      url += '?search=' + search;
    }
    
    console.log(url);
    return this.http.get<Book[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getGenres() {
    let url = urlServer + 'genres';

    return this.http.get<Genre[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getGenre(idGenre: number) {
    let url = urlServer + 'genre/' + idGenre;

    return this.http.get<Genre>(url);
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
  getBorrows() {
    let url = urlServer + 'borrows';
    url = "http://127.0.0.1:8000/borrows";

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsFromUser(user: User)
  {
    let idUser = user.idUser;
    let url = urlServer + 'borrows';
    url = "http://127.0.0.1:8000/borrows/" + idUser;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsOrderedBy(user: User, order:any)
  {
    let idUser = user.idUser;
    let url = urlServer + 'borrows';
    url = "http://127.0.0.1:8000/borrows/" + idUser + "/" + order;

    return this.http.get<Borrow[]>(url);
  }

  //--------------------------------
  // Route to connect a user
  //--------------------------------
  connection(user: User) {
    let url = urlServer + 'users/connection';
    
    const params = new HttpParams({
      fromObject: {
        memberNumber: user.memberNumber,
        password: user.password
      }
    });

    return this.http.post<User>(url, params);
  }

  //--------------------------------
  // Route to get all the books
  //--------------------------------
  
  //route qui va chercher un livre
  getBook(id:number){
    let url = urlServer + 'getBook/'+id;

    return this.http.get<Book>(url);
  }
}