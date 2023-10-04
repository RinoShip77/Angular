import { Component } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { ElectrolibService } from '../electrolib.service';
import { format } from 'date-fns';

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

  constructor(private electrolibService: ElectrolibService) { }

  ngOnInit() {

    this.retrieveBorrows();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveBorrows() {
    this.electrolibService.getBorrows().subscribe(
      borrows => {
        this.borrows = borrows;
        this.displayedBorrows = borrows;
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
