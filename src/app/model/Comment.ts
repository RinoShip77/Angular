import { User } from "./User";

export class Comment 
{
    idComment: number = 0;
    reason: string = '';
    content: string = '';
    user: User = new User();
    idUser:number = 0;
    
    isFixed:number = 0;
    createdDate: string = "";
    resolvedDate: string = "";

    formatedCreatedDate()
    {
        return this.createdDate.split(" ")[0];
    }
    formatedResolvedDate()
    {
        return this.resolvedDate.split(" ")[0];
    }
}