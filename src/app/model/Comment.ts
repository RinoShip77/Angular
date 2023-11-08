import { User } from "./User";

export class Comment 
{
    idComment: number = 0;
    reason: string = '';
    content: string = '';
    user: User = new User();
    idUser:number = 0;
}