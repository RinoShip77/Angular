import { Component, ElementRef, ViewChild } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { ElectrolibService } from '../electrolib.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-borrows',
  templateUrl: './admin-borrows.component.html',
  styleUrls: ['./admin-borrows.component.css']
})
export class AdminBorrowsComponent {

  borrows: Borrow[] = [];
  displayedBorrows: Borrow[] = [];

  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";

  isChecked: Boolean = true;

  constructor(private electrolibService: ElectrolibService) { }

  ngOnInit() {

    this.retrieveBorrows();
  }

  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.showBorrowsCriteria();
  }

  showBorrowsCriteria() {
    let tempBorrows: Borrow[] = [];

    if (this.isChecked) {

      this.borrows.forEach(borrow => {
        if (borrow.returnedDate === null ) {
          tempBorrows.push(borrow);
        }
      });
      this.displayedBorrows = tempBorrows;
    } 

    else {
      this.displayedBorrows = this.borrows;
    }
  }

  returnBorrow(borrow: Borrow) {
      let returnedBorrow: Borrow = borrow;
      returnedBorrow.returnedDate = new Date();

      this.electrolibService.returnBorrow(returnedBorrow).subscribe(
        (response) => {
          console.log('Book returned successfully!', response);
          this.showBorrowsCriteria();
        },
        (error) => {
          console.error('Returned failed:', error);
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
  //
  //-------------------------------------------------------
  search() {
    if (this.searchField.trim().length > 0) {

    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  checkIfLate(borrow: Borrow) {
    const nowDate: Date = new Date();
    const dueDate: Date = new Date(borrow.dueDate);

    if (nowDate >= dueDate) {
      return "En retard";
    }

    return "";
  }

}
