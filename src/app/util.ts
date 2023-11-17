export const urlServer = 'https://localhost:8000/';
export const MAX_FILE_SIZE:number = 500*1048;
export const ENCRYPTION_KEY: string = '123456$#@$^@1ERF';
export const ISBN_REGEX = /^[0-9]{13}$/;
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]{3,}(\.[^<>()\[\]\\.,;:\s@"]{3,})*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const POSTAL_CODE_REGEX = /^[A-GHJ-NPR-TVXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
export const PHONE_NUMBER_REGEX = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;

export function getURLBookCover(idBook: number)
{
  let urltmp = urlServer + '../images/books/' + idBook + ".png"; 
  return urltmp;
}

export function getURLProfilePicture(idUser: number | undefined, timestamp?: number)
{
  let url = '';
  
  if(idUser) {
    url = urlServer + '../images/users/' + idUser + "_" + timestamp + ".png";
  }

  return url;
}