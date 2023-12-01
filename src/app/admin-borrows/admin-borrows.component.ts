import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { ElectrolibService } from '../electrolib.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-borrows',
  templateUrl: './admin-borrows.component.html',
  styleUrls: ['./admin-borrows.component.css']
})
export class AdminBorrowsComponent {

  borrows: Borrow[] = [];
  displayedBorrows: Borrow[] = [];
  book: Book = new Book();
  borrow: Borrow = new Borrow();
  genres: Genre[] = [];

  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";

  isChecked: Boolean = true;
  isCheckedLates: Boolean = false;
  desc: boolean = true;
  loaded = false;
  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private dataService: DataService) { }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveBorrows();
    this.retrieveGenres();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifyIfResultFound() {
    if (this.displayedBorrows.length == 0 && this.loaded) {
      return true;
    }
    return false;
  }

  //---------------------------------
  // Function to change the theme for all the application
  //---------------------------------
  changeTheme() {
    if (this.colorSwitch) {
      localStorage.setItem('theme', 'dark');
      this.switchTheme.emit('dark');
    } else {
      localStorage.setItem('theme', 'light');
      this.switchTheme.emit('light');
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  sortColumnBy(sortBy: string) {
    this.selectedSearchBy = sortBy;
    if (this.desc) {
      this.desc = false;
      this.selectedSortBy = "descending";
    }
    else {
      this.desc = true;
      this.selectedSortBy = "ascending";
    }
      
    this.sortBorrows();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.showBorrowsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxStateLates(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isCheckedLates = target.checked;

    this.showBorrowsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  showBorrowsCriteria() {
    this.displayedBorrows = [];

    // Afficher seulement les emprunts en cours et seulement les retards
    if (this.isChecked && this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (borrow.returnedDate === null && this.checkIfLate(borrow) != "") {
          this.displayedBorrows.push(borrow);
        }
      });
    }

    // Afficher seulement les emprunts en cours, en retard ou non
    else if (this.isChecked && !this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (borrow.returnedDate === null) {
          this.displayedBorrows.push(borrow);
        }
      });
    }

    // Afficher tous les emprunts en retard
    else if (!this.isChecked && this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (this.checkIfLate(borrow) != "") {
          this.displayedBorrows.push(borrow);
        }
      });
    }

    // Afficher tous les emprunts en cours, en retard ou non
    else {
      this.displayedBorrows = this.borrows;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  returnBorrow(borrow: Borrow) {
    let returnedBorrow: Borrow = borrow;

    this.electrolibService.returnBorrow(returnedBorrow).subscribe(
      (response) => {
        console.log('Book returned successfully!', response);
        this.retrieveBorrows();
        this.showBorrowsCriteria();
      },
      (error) => {
        console.error('Return failed:', error);
      }
    );
  }


  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveBorrows() {
    this.electrolibService.getBorrows().subscribe(
      borrows => {
        this.borrows = borrows;
        this.showBorrowsCriteria();
        this.loaded = true;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeResearchBy(type: String) {
    this.selectedSearchBy = type;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeSortBy(type: String) {
    this.selectedSortBy = type;
  }

  //-------------------------------------------------------
  // Tri les emprunts
  //-------------------------------------------------------
  sortBorrows() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBorrows.sort((a, b) => (a.book.title.toUpperCase() > b.book.title.toUpperCase() ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedBorrows.sort((a, b) => (a.user.memberNumber > b.user.memberNumber ? 1 : -1));
          break;
        case "borrowedDate":
          this.displayedBorrows.sort((a, b) => (a.borrowedDate > b.borrowedDate ? 1 : -1));
          break;
        case "dueDate":
          this.displayedBorrows.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
          break;
      }
    }
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBorrows.sort((a, b) => (a.book.title.toUpperCase() < b.book.title.toUpperCase() ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedBorrows.sort((a, b) => (a.user.memberNumber < b.user.memberNumber ? 1 : -1));
          break;
        case "borrowedDate":
          this.displayedBorrows.sort((a, b) => (a.borrowedDate < b.borrowedDate ? 1 : -1));
          break;
        case "dueDate":
          this.displayedBorrows.sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));
          break;
      }
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  search() {
    if (this.searchField.trim().length > 0) {
      let tempBorrows: Borrow[] = [];

      this.displayedBorrows.forEach(borrow => {
        if (this.isBorrowValid(borrow)) {
          switch (this.selectedSearchBy) {
            case "title":
              if (this.isFieldValid(borrow.book.title)) {
                tempBorrows.push(borrow);
              }
              break;
            case "memberNumber":
              if (this.isFieldValid(borrow.user.memberNumber)) {
                tempBorrows.push(borrow);
              }
              break;
            case "borrowedDate":
              if (this.isFieldValid(borrow.borrowedDate.toString())) {
                tempBorrows.push(borrow);
              }
              break;
            case "dueDate":
              if (this.isFieldValid(borrow.dueDate.toString())) {
                tempBorrows.push(borrow);
              }
              break;
          }
          this.displayedBorrows = tempBorrows;
        }
      });
    }
    else {
      this.showBorrowsCriteria();
    }
    this.sortBorrows();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  isFieldValid(value: string) {
    return value.toUpperCase().includes(this.searchField.toUpperCase());
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  isBorrowValid(borrow: Borrow) {
    if (this.isChecked && borrow.returnedDate != null) {
      return false;
    }
    return true;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  checkIfLate(borrow: Borrow) {
    const nowDate: Date = new Date();
    const dueDate: Date = new Date(borrow.dueDate);

    if (borrow.returnedDate === null) {
      if (nowDate > dueDate) {
        return "En retard";
      }
    }
    else {
      const returnedDate: Date = new Date(borrow.returnedDate);
      if (dueDate < returnedDate) {
        return "Retourné avec retard";
      }
    }

    return "";
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openAbout(content: any, idBook: number) {
    this.book = new Book();
    this.electrolibService.getBook(idBook).subscribe(
      book => {
        this.book = book;
      }
    );

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openConfirmReturnBorrow(content: any, borrow: Borrow) {
    this.borrow = borrow;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
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
  getGenre(idGenre: number) {
    const genre = this.genres.find(genre => genre.idGenre === idGenre);
    return genre?.name;
  }

}
