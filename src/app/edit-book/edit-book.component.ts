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
import { DataService } from '../data.service';

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

  errors: { [key: string]: string | null } = {
    title: null,
    description: null,
    isbn: null,
    publishedDate: null,
    originalLanguage: null,
    cover: null,
    idAuthor: null,
    idGenre: null
  };

  constructor(
    private electrolibService: ElectrolibService, 
    private route: ActivatedRoute, 
    private router: Router,
    private dataService: DataService) {}

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
    this.validateAllFields();
    console.log(this.validateForm());
    if (this.validateForm()) {
      this.electrolibService.updateBook(this.book, this.file_data).subscribe(
        updatedBook => {
          console.log('Book updated successfully!', updatedBook);
          this.changeTab('inventory');
          this.router.navigate(["/adminInventory"]);
        },
        (error) => {
          console.error('Update failed:', error);
        }
      );
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
        this.errors["cover"] = null;
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
      if (extension?.toLowerCase() == 'png' || extension?.toLowerCase() == 'jpg' || extension?.toLowerCase() == 'jpeg') {
        fileSupported = true;
      }
      else {
        this.errors["cover"] = "Extension de fichier non-supportée. Votre image doit petre de type PNG, JPG ou JPEG.";
      }
    }
    else {
      fileSupported = false;
      this.errors["cover"] = "Fichier trop volumineux. Maximum 500 kB et le fichier a " + (this.selectedImage.size / 1024).toFixed(0) + " kB";
    }

    return fileSupported;
  }

  //-------------------------------------------------------
  // Valide le titre du livre
  //-------------------------------------------------------
  validateTitle() {
    if (this.book.title.length <= 0 || this.book.title.length > 100) {
      this.errors["title"] = "Le titre doit contenir entre 1 et 100 caractères.";
    } else {
      this.errors["title"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide la description du livre
  //-------------------------------------------------------
  validateDescription() {
    if (this.book.description.length <= 0 || this.book.description.length > 255) {
      
      this.errors["description"] = "La description doit contenir entre 1 et 2048 caractères.";
    } else {
      this.errors["description"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide l'ISBN du livre
  //-------------------------------------------------------
  validateISBN() {
    if (this.book.isbn.length <= 0 || this.book.isbn.length > 255) {
      
      this.errors["isbn"] = "L'ISBN doit contenir entre 1 et 255 caractères.";
    } else {
      this.errors["isbn"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide la date de publication du livre
  //-------------------------------------------------------
  validatePublishedDate() {
    if (this.book.publishedDate.length <= 0) {
      
      this.errors["publishedDate"] = "Vous devez fournir une date de publication.";
    } else {
      this.errors["publishedDate"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide la langue originale du livre
  //-------------------------------------------------------
  validateOriginalLanguage() {
    if (this.book.originalLanguage.length <= 0 || this.book.originalLanguage.length > 255) {
      
      this.errors["originalLanguage"] = "La langue doit contenir entre 1 et 255 caractères.";
    } else {
      this.errors["originalLanguage"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide l'auteur' du livre
  //-------------------------------------------------------
  validateIdAuthor() {
    if (!this.book.idAuthor) {
      
      this.errors["idAuthor"] = "Vous devez fournir un auteur.";
    } else {
      this.errors["idAuthor"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide le genre du livre
  //-------------------------------------------------------
  validateIdGenre() {
    if (!this.book.idGenre) {
      
      this.errors["idGenre"] = "Vous devez fournir un genre.";
    } else {
      this.errors["idGenre"] = null;
    }
  }

  //-------------------------------------------------------
  // Valide tous les champs du livre
  //-------------------------------------------------------
  validateAllFields() {
    this.validateTitle();
    this.validateDescription();
    this.validateISBN();
    this.validatePublishedDate();
    this.validateOriginalLanguage();
    this.validateIdAuthor();
    this.validateIdGenre();
  }

  //-------------------------------------------------------
  // Valide le formulaire du livre
  //-------------------------------------------------------
  validateForm() {
    for (const key in this.errors) {
      if (this.errors.hasOwnProperty(key) && this.errors[key] !== null) {
        return false;
      }
    }
    return true;
  }
  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }
}
