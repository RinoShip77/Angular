export const urlServer = 'https://localhost:8000/';
export const MAX_FILE_SIZE:number = 500*1048;
export const ENCRYPTION_KEY: string = '123456$#@$^@1ERF';

export function getURLBookCover(idBook: number)
{
  let urltmp = urlServer + '../images/books/' + idBook + ".png"; 
  return urltmp;
}

export function getURLProfilePicture(idUser: number | undefined)
{
  let url = '';
  
  if(idUser) {
    url = urlServer + '../images/users/' + idUser + ".png";
  }

  return url;
}