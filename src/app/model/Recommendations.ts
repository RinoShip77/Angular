import { Book } from "./Book";

export class Recommendations {
    fromBorrows: Book[] = new Array();
    fromFavorites: Book[] = new Array();
    fromAdmin: Book[] = new Array();
}