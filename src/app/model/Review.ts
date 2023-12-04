import { Book } from "./Book";
import { User } from "./User";

export class Review 
{
    idReview: number = 0;
    message: string = '';
    rating: number = 0;
    reviewDate: string = "";

    user: User = new User();
    idUser:number = 0;

    book: Book = new Book();
    idBook:number = 0;
    

    formatedReviewDate()
    {
        return this.reviewDate.split(" ")[0];
    }
}