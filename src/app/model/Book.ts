export class Book {
  idBook: number = 0;
  title: string = '';
  description: string = '';
  isbn: string = '';
  isBorrowed: boolean = false;
  cover: string = '';
  publishedDate: Date = new Date();
  originalLanguage: string = '';
}