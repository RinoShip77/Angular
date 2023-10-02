import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  getBooks() {
    let url = urlServer + 'books';

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
  
  //route qui va chercher un livre
  getBook(id:number){
    let url = urlServer + 'get-book/'+id;

    return this.http.get<Book>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  uploadImage(imageData: string) {
    const formData = new FormData();
    formData.append('image', imageData);

    let url = urlServer + "createBook";

    return this.http.post(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createBookWithImage(book: Book, imageData: Blob) {
    let url = `${urlServer}createBook`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('isBorrowed', book.isBorrowed.toString());
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());

    return this.http.post<Book>(url, formData);
  }

  createBorrow(book:Book,user:User){
    const url = `${urlServer}create-Borrow`;
    console.log(user.idUser);
    const formData = new FormData();
    formData.append('idBook',book.idBook.toString());
    formData.append('idUser',user.idUser.toString());

    return this.http.post<Borrow>(url,formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  updateBook(book: Book, imageData: Blob) {
    let url = `${urlServer}updateBook/${book.idBook}`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('isBorrowed', book.isBorrowed.toString());
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());

    return this.http.post<Book>(url, formData);

    //NE PAS ENLEVER LE CODE EN COMMENTAIRE: JE VEUX ESSAYER DE FAIRE FONCTIONNER LE PUT PLUS TARD
    /*const updatedBook = {
      title: book.title,
      description: book.description,
      isbn: book.isbn,
      publishedDate: book.publishedDate,
      originalLanguage: book.originalLanguage,
      isBorrowed: book.isBorrowed,
      idAuthor: book.idAuthor,
      idGenre: book.idGenre,
    };
  
    const formData = new FormData();
    formData.append('cover', imageData);
  
    const requestData = {
      book: updatedBook,
      image: formData,
    };

    //PEUT-ÊTRE UNE ERREUR AVEC LE FORM QUE J'ENVOIE (À VÉRIFIER)
    return this.http.put<Book>(url, requestData);*/
  }
}