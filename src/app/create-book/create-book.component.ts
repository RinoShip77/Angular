import { Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../model/Book';
import { ElectrolibService } from '../electrolib.service';
import { MAX_FILE_SIZE } from '../util';
import { Author } from '../model/Author';
import { Genre } from '../model/Genre';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent {

  book: Book = new Book();
  authors: Author[] = [];
  genres: Genre[] = [];

  selectedImage: any;
  formData = new FormData();
  file: any;
  file_data: any = "";

  validations: { [key: string]: boolean | null | undefined } = {
    title: null,
    description: null,
    isbn: null,
    publishedDate: null,
    originalLanguage: null,
    cover: null,
    idAuthor: null,
    idGenre: null
  };

  constructor(private electrolibService: ElectrolibService, private router: Router) { }

  ngOnInit() {
    this.retrieveAuthors();
    this.retrieveGenres();
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
  // Envoie les données du formulaire au serveur Symfony
  //-------------------------------------------------------
  onSubmit() {
    if (this.validateForm()) {
      this.electrolibService.createBookWithImage(this.book, this.file_data).subscribe(
        createdBook => {
          console.log('Book and image created successfully!', createdBook);
          this.router.navigate(["/adminInventory"]);
        },
        (error) => {
          console.error('Creation failed:', error);
        }
      );
    } else {
      this.validateAllFiends();
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
  // Valide le titre du livre
  //-------------------------------------------------------
  validateTitle() {
    if (this.book.title.length <= 0 || this.book.title.length > 100) {
      this.validations["title"] = false;
    } else {
      this.validations["title"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide la description du livre
  //-------------------------------------------------------
  validateDescription() {
    if (this.book.description.length <= 0 || this.book.description.length > 255) {
      this.validations["description"] = false;
    } else {
      this.validations["description"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide l'ISBN du livre
  //-------------------------------------------------------
  validateISBN() {
    if (this.book.isbn.length <= 0 || this.book.isbn.length > 255) {
      this.validations["isbn"] = false;
    } else {
      this.validations["isbn"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide la date de publication du livre
  //-------------------------------------------------------
  validatePublishedDate() {
    if (this.book.publishedDate.length <= 0) {
      this.validations["publishedDate"] = false;
    } else {
      this.validations["publishedDate"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide la langue originale du livre
  //-------------------------------------------------------
  validateOriginalLanguage() {
    if (this.book.originalLanguage.length <= 0 || this.book.originalLanguage.length > 255) {
      this.validations["originalLanguage"] = false;
    } else {
      this.validations["originalLanguage"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide l'image de couverture du livre
  //-------------------------------------------------------
  validateCover() {
    if (this.validations["cover"] == null) {
      this.validations["cover"] = undefined;
    } 
    else if (!this.validations["cover"] == null) {
      this.validations["cover"] = false;
    }
  }

  //-------------------------------------------------------
  // Valide l'auteur' du livre
  //-------------------------------------------------------
  validateIdAuthor() {
    if (!this.book.idAuthor) {
      this.validations["idAuthor"] = false;
    } else {
      this.validations["idAuthor"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide le genre du livre
  //-------------------------------------------------------
  validateIdGenre() {
    if (!this.book.idGenre) {
      this.validations["idGenre"] = false;
    } else {
      this.validations["idGenre"] = true;
    }
  }

  //-------------------------------------------------------
  // Valide tous les champs du livre
  //-------------------------------------------------------
  validateAllFiends() {
    this.validateTitle();
    this.validateDescription();
    this.validateISBN();
    this.validatePublishedDate();
    this.validateOriginalLanguage();
    this.validateCover();
    this.validateIdAuthor();
    this.validateIdGenre();
  }

  //-------------------------------------------------------
  // Valide le formulaire du livre
  //-------------------------------------------------------
  validateForm() {
    for (const key in this.validations) {
      if (this.validations.hasOwnProperty(key) && (this.validations[key] === null || this.validations[key] === false)) {
        return false;
      }
    }
    return true;
  }
}
