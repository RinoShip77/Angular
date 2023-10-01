export const urlServer = 'https://127.0.0.1:8000/';
export const MAX_FILE_SIZE:number = 500*1048;

export function getURLBookCover(idBook: number)
{
  let urltmp = urlServer + '../images/books/' + idBook + ".png"; 
  return urltmp;
}