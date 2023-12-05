import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './model/Book';
import { User } from './model/User';
import { Genre } from './model/Genre';
import { Author } from './model/Author';
import { Borrow } from './model/Borrow';
import { Status } from './model/Status';
import { Reservation } from './model/Reservation';
import { Evaluation } from './model/Evaluation';
import { Favorite } from './model/Favorite';
import { Comment } from './model/Comment';
import { Recommendations } from './model/Recommendations'
import { Review } from './model/Review';
import { Stats } from './model/stats';

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
  // Route to get all the available books
  //--------------------------------
  getAvailableBooks() {
    let url = urlServer + 'available-books';

    return this.http.get<Book[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getUsers() {
    let url = urlServer + 'users';

    return this.http.get<User[]>(url);
  }

  getRecommended(idUser: number) {
    let url = urlServer + 'recommandation/' + idUser;

    return this.http.get<Recommendations>(url);
  }

  getStats(idUser: number) {
    let url = urlServer + 'userStats/' + idUser;

    return this.http.get<Stats>(url);
  }
  //--------------------------------
  //
  //--------------------------------
  getGenres() {
    let url = urlServer + 'genres';

    return this.http.get<Genre[]>(url);
  }

  //--------------------------------
  //
  //--------------------------------
  getAllStatus() {
    let url = urlServer + 'all-status';

    return this.http.get<Status[]>(url);
  }

  //--------------------------------
  // Route to get the number of books in a status
  //--------------------------------
  getStatusNumber(idStatus: number){
    let url = `${urlServer}genre/books/${idStatus}`;

    return this.http.get<number>(url)
  }

  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getGenre(idGenre: number) {
    let url = urlServer + 'genre/' + idGenre;

    return this.http.get<Genre>(url);
  }

  //--------------------------------
  // Route to get the number of books in a genre
  //--------------------------------
  getGenreNumber(idGenre: number) {
    let url = `${urlServer}genre/books/${idGenre}`;

    return this.http.get<number>(url)
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
  // Route to get the number of books by an author
  //--------------------------------
  getAuthorNumber(idAuthor: number) {
    let url = `${urlServer}author/books/${idAuthor}`;

    return this.http.get<number>(url)
  }

  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getBorrows() {
    let url = urlServer + 'borrows';
    //url = "http://127.0.0.1:8000/borrows";

    return this.http.get<Borrow[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getActiveBorrows() {
    let url = urlServer + 'active-borrows';

    return this.http.get<Borrow[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  returnBorrow(borrow: Borrow) {
    let url = `${urlServer}return-borrow/${borrow.idBorrow}`;

    return this.http.post<Borrow>(url, new FormData());
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  returnLateBorrow(borrow: Borrow, fees:number) {
    let url = `${urlServer}return-late-borrow`;

    const formData = new FormData();
    formData.append('idBorrow', borrow.idBorrow.toString());
    formData.append('fees', fees.toString());

    return this.http.post<Borrow>(url, formData);
  }

  getBorrow(idBorrow:Number)
  {
    let url = urlServer + "borrows/borrow/" + idBorrow;
    return this.http.get<Borrow>(url);
  }

  getBorrowsFromUser(user: User) {
    let idUser = user.idUser;
    let url = urlServer + 'borrows/' + idUser;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsHistoryFromUser(user: User) {
    let idUser = user.idUser;
    let url = urlServer + "borrows/history/" + idUser;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsOrderedBy(user: User, order: any) {
    let idUser = user.idUser;
    let url = urlServer + "borrows/" + idUser + "/" + order;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsHistoryOrderedBy(user: User, order: any) {
    let idUser = user.idUser;
    let url = urlServer + "borrows/history/" + idUser + "/" + order;

    return this.http.get<Borrow[]>(url);
  }

  renewDueDate(borrow: Borrow) {
    let idBorrow = borrow.idBorrow;
    let url = urlServer + "renew/" + idBorrow;

    return this.http.get<any>(url);
  }

  getReservationsFromUser(user: User) {
    let idUser = user.idUser;
    let url = urlServer + 'reservations/' + idUser;
    return this.http.get<Reservation[]>(url);
  }

  getReservationsOrderedBy(user: User, order: any) {
    let idUser = user.idUser;
    let url = urlServer + 'borrows';
    url = urlServer + "reservations/" + idUser + "/" + order;

    return this.http.get<Reservation[]>(url);
  }

  cancelReservationUser(reservation: Reservation) {
    let url = urlServer + "reservations-cancel/" + reservation.idReservation;

    return this.http.get<any>(url);
  }

  reactivateReservationUser(reservation: Reservation) {
    let url = urlServer + "reservations-reactivate/" + reservation.idReservation;

    return this.http.get<any>(url);
  }

  getBorrowFromBook(idBook: Number) {
    let url = urlServer + 'borrows/book/' + idBook;
    return this.http.get<Borrow>(url);
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
  getBook(id: number) {
    let url = urlServer + 'get-book/' + id;

    return this.http.get<Book>(url);
  }

  //route qui va chercher un livre
  getBookBorrowed(id: number) {
    let url = urlServer + 'getBookBorrowed/' + id;

    return this.http.get<Book>(url);
  }

  //--------------------------------
  // Créer un livre
  //--------------------------------
  /*createBook(book: Book) {
    let url = urlServer + "createBook";

    const params = new HttpParams({
      fromObject: {
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        originalLanguage: book.originalLanguage,
        isBorrowed: book.isBorrowed,
        cover: book.cover,
        idAuthor: book.idAuthor,
        idGenre: book.idGenre
      }
    });

    return this.http.post<Book>(url, params);
  }*/

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
    let url = `${urlServer}create-book`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());
    formData.append('idStatus', book.idStatus.toString());
    formData.append('isRecommended', "0");

    return this.http.post<Book>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createUser(user: User) {
    let url = `${urlServer}create-user`;

    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('address', user.address);
    formData.append('postalCode', user.postalCode);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('roles', user.roles);
    formData.append('password', user.password);

    return this.http.post<User>(url, formData);
  }

  createComment(comment: Comment, user: User) {
    const url = `${urlServer}create-comment`;
    const formData = new FormData();

    formData.append('reason', comment.reason);
    formData.append('content', comment.content);
    formData.append('idUser', user.idUser.toString());

    return this.http.post<Comment>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createBorrow(idUser: number, idBook: number) {
    const url = `${urlServer}create-borrow`;
    const formData = new FormData();

    formData.append('idUser', idUser.toString());
    formData.append('idBook', idBook.toString());

    return this.http.post<Borrow>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createAuthor(author: Author) {
    const url = `${urlServer}create-author`;
    const formData = new FormData();

    formData.append('firstName', author.firstName);
    formData.append('lastName', author.lastName);

    return this.http.post<Author>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createGenre(genre: Genre) {
    const url = `${urlServer}create-genre`;
    const formData = new FormData();

    formData.append('name', genre.name);

    return this.http.post<Genre>(url, formData);
  }


  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  updateBook(book: Book, imageData: Blob) {
    let url = `${urlServer}update-book/${book.idBook}`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());
    formData.append('idStatus', book.idStatus.toString());
    formData.append('isRecommended', book.isRecommended.toString());

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

  //--------------------------------
  // Route to get one user
  //--------------------------------
  getUser(idUser: number) {
    let url = urlServer + 'users/' + idUser;

    return this.http.get<User>(url);
  }

  //--------------------------------
  // Update the profile picture
  //--------------------------------
  uploadProfilePicture(idUser: number | undefined, timestamp: number, imageData: string) {
    const formData = new FormData();
    formData.append('action', 'updatePicture');
    formData.append('timestamp', timestamp.toString());
    formData.append('profilePicture', imageData);

    let url = urlServer + 'users/modify/' + idUser;

    return this.http.post(url, formData);
  }

  //--------------------------------
  // Update the profile informations
  //--------------------------------
  updateUser(action: string, idUser: number | undefined, object?: any) {
    let url = urlServer + 'users/modify/' + idUser;

    const params = new HttpParams({
      fromObject: {
        action: action,
        newPassword: object?.newPassword,
        email: object?.email,
        firstName: object?.firstName,
        lastName: object?.lastName,
        address: object?.address,
        postalCode: object.postalCode,
        phoneNumber: object?.phoneNumber
      }
    });

    return this.http.post(url, params);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getReservations() {
    let url = urlServer + 'reservations';

    return this.http.get<Reservation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getAdminReservations() {
    let url = urlServer + 'admin-reservations';

    return this.http.get<Reservation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  findOneReservationFromUser(idUser: Number | undefined, idBook: Number) {
    let url = `${urlServer}reservation/${idUser}/${idBook}`;
    return this.http.get<Boolean>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBookReservations(idBook: Number) {
    let url = `${urlServer}book-reservations/${idBook}`;
    return this.http.get<Reservation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  findOneBorrowFromUser(idUser: Number | undefined, idBook: Number) {
    let url = `${urlServer}borrow/${idUser}/${idBook}`;
    return this.http.get<Boolean>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createReservation(idUser: number, idBook: number) {
    const url = `${urlServer}create-reservation`;
    const formData = new FormData();

    formData.append('idUser', idUser.toString());
    formData.append('idBook', idBook.toString());

    return this.http.post<Reservation>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getEvaluations() {
    let url = urlServer + 'evaluations';

    return this.http.get<Evaluation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getFavorites() {
    let url = urlServer + 'favorites';

    return this.http.get<Favorite[]>(url);
  }

  getFavoriteNbr(idBook: number) {
    let url = `${urlServer}getNbrFav/${idBook}`;

    return this.http.get<number>(url)
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  cancelReservation(reservation: Reservation) {
    let url = `${urlServer}cancel-reservation/${reservation.idReservation}`;
    const formData = new FormData();

    return this.http.post<String>(url, formData);
  }

  getIfFavorited(book: Book, user: User) {
    const url = `${urlServer}getIfFav`;
    const formData = new FormData();
    formData.append('idBook', book.idBook.toString());
    formData.append('idUser', user.idUser.toString());
    return this.http.post<Number>(url, formData);
  }

  deleteFavorite(book: Book, user: User) {
    const url = `${urlServer}delFav`;
    const formData = new FormData();
    formData.append('idBook', book.idBook.toString());
    formData.append('idUser', user.idUser.toString());
    return this.http.post<Number>(url, formData);
  }

  createFavorite(book: Book, user: User) {
    const url = `${urlServer}create-favorite`;
    const formData = new FormData();
    formData.append('idBook', book.idBook.toString());
    formData.append('idUser', user.idUser.toString());

    return this.http.post<Favorite>(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  payFees(idUser: number | null) {

    let url = `${urlServer}payFees/${idUser}`;

    return this.http.get<any>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getComments($order:string) {

    let url = `${urlServer}comments/` + $order;

    return this.http.get<Comment[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getCommentsNotResolved($order:string) {

    let url = `${urlServer}comments-not-resolved/` + $order;

    return this.http.get<Comment[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getCommentsResolved($order:string) {

    let url = `${urlServer}comments-resolved/` + $order;

    return this.http.get<Comment[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  commentsFixed(comment: Comment) {

    let url = `${urlServer}comment-fixed/` + comment.idComment;

    return this.http.get<Comment>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getReviews(idBook: number) {

    let url = `${urlServer}reviews/` + idBook;

    return this.http.get<Review[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createReview(review:Review, user:User, book:Book){
    const url = `${urlServer}create-review`;
    const formData = new FormData();

    formData.append('message', review.message);
    formData.append('rating', review.rating.toString());
    formData.append('idUser', user.idUser.toString());
    formData.append('idBook', book.idBook.toString());

    return this.http.post<Review>(url, formData);
  }
}