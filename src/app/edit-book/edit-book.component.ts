import { Component } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../model/Book';
import { Router } from '@angular/router';
import { Author } from '../model/Author';
import { Genre } from '../model/Genre';
import { MAX_FILE_SIZE } from '../util';
import { format, parse } from 'date-fns';
import { Status } from '../model/Status';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent {

  book: Book = new Book();
  authors: Author[] = [];
  genres: Genre[] = [];
  status: Status[] = [];

  selectedImage: any;
  formData = new FormData();
  file: any;
  file_data: any = "";

  validations: { [key: string]: boolean } = {
    title: true,
    description: true,
    isbn: true,
    publishedDate: true,
    originalLanguage: true,
    cover: true
  };

  constructor(
    private electrolibService: ElectrolibService, 
    private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if(id) {
     this.electrolibService.getBook(id).subscribe(book =>{
      this.book = book;
      const parsedDate = parse(book.publishedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
      this.book.publishedDate = format(parsedDate, 'yyyy-MM-dd');
     });
    }
    
    this.retrieveAuthors();
    this.retrieveGenres();
    this.retrieveAllStatus();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveAuthors() {
    this.electrolibService.getAuthors().subscribe(
      authors => {
        this.authors = authors;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveGenres() {
    this.electrolibService.getGenres().subscribe(
      genres => {
        this.genres = genres;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveAllStatus() {
    this.electrolibService.getAllStatus().subscribe(
      status => {
        this.status = status;
      }
    );
  }

  //-------------------------------------------------------
  // Envoie les données du formulaire au serveur Symfony
  //-------------------------------------------------------
  onSubmit() {
    //PEUT-ÊTRE UNE ERREUR AVEC LE FORM QUE J'ENVOIE (À VÉRIFIER)
    if (this.validateForm()) {
      this.electrolibService.updateBook(this.book, this.file_data).subscribe(
        (response) => {
          console.log('Book updated successfully!', response);
          this.router.navigate(["/adminInventory"]);
        },
        (error) => {
          console.error('Update failed:', error);
        }
      );
    } else {
      this.validateAllFields();
    }
  }

  //-------------------------------------------------------
  // Téléversement d'une image
  //-------------------------------------------------------
  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.selectedImage = fileList[0];

      if (this.validateFile()) {
        const blob = new Blob([this.selectedImage], { type: this.selectedImage.type });

        this.file_data = blob;
        this.validations["cover"] = true;
      } else {
        this.validations["cover"] = false;
      }
    }
  }

  //-------------------------------------------------------
  // Retourne l'extension de l'image
  //-------------------------------------------------------
  extractExtension(nomFichier: string) {
    let extension = nomFichier.split('.').pop();
    console.log("l'extension du fichier est " + extension);
    return extension;
  }

  //-------------------------------------------------------
  // Valide l'image avant de l'envoyer en base de données
  //-------------------------------------------------------
  validateFile() {
    let fileSupported = false;
    if (this.selectedImage.size <= MAX_FILE_SIZE) {
      let extension = this.extractExtension(this.selectedImage.name);
      if (extension?.toLowerCase() == 'png') {
        fileSupported = true;
      }
      if (!fileSupported)
        console.log("Erreur: extension de fichier non-supportée", true)
    }
    else {
      fileSupported = false;
      console.log("Erreur: Fichier trop volumineux. Maximum 500 kB et le fichier a " + (this.selectedImage.size / 1024).toFixed(0) + " kB", true, true)
    }

    return fileSupported;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateTitle() {
    if (this.book.title.length <= 0 || this.book.title.length > 100) {
      this.validations["title"] = false;
    } else {
      this.validations["title"] = true;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateDescription() {
    if (this.book.description.length <= 0 || this.book.description.length > 255) {
      this.validations["description"] = false;
    } else {
      this.validations["description"] = true;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateISBN() {
    if (this.book.isbn.length <= 0 || this.book.isbn.length > 255) {
      this.validations["isbn"] = false;
    } else {
      this.validations["isbn"] = true;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validatePublishedDate() {
    if (this.book.publishedDate.length <= 0) {
      this.validations["publishedDate"] = false;
    } else {
      this.validations["publishedDate"] = true;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateOriginalLanguage() {
    if (this.book.originalLanguage.length <= 0 || this.book.originalLanguage.length > 255) {
      this.validations["originalLanguage"] = false;
    } else {
      this.validations["originalLanguage"] = true;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateAllFields() {
    this.validateTitle();
    this.validateDescription();
    this.validateISBN();
    this.validatePublishedDate();
    this.validateOriginalLanguage();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  validateForm() {
    for (const key in this.validations) {
      if (this.validations.hasOwnProperty(key) && this.validations[key] === false) {
        return false;
      }
    }
    return true;
  }
}
