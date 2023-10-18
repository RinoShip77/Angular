export const urlServer = 'http://localhost:8000/';
export const MAX_FILE_SIZE:number = 500*1048;

export function getURLBookCover(idBook: number)
{
  let urltmp = urlServer + '../images/books/' + idBook + ".png"; 
  return urltmp;
}

export function getURLProfilePicture(idUser: number | undefined)
{
  let urltmp = urlServer + '../images/users/' + idUser + ".png"; 
  return urltmp;
}