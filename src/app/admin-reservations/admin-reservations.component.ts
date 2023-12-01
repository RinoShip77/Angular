import { Component, EventEmitter, Output } from '@angular/core';
import { Reservation } from '../model/Reservation';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Genre } from '../model/Genre';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent {

  reservations: Reservation[] = [];
  displayedReservations: Reservation[] = [];
  activeBorrows: Borrow[] = [];
  book: Book = new Book();
  BorrowReturnedMessage: string = "Retourné";
  reservation: Reservation = new Reservation();
  genres: Genre[] = [];

  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";
  desc: boolean = true;
  loaded = false;

  isChecked = true;
  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private dataService: DataService) { }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveReservations();
    this.retrieveGenres();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifyIfResultFound() {
    if (this.displayedReservations.length == 0 && this.loaded) {
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
  getBorrowMemberNumber(reservation: Reservation) {
    if (reservation.borrowMemberNumber && reservation.borrow.returnedDate == null) {
      return reservation.borrowMemberNumber;
    }
    return this.BorrowReturnedMessage;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBorrowDueDate(reservation: Reservation) {
    if (reservation.borrowDueDate && reservation.borrow.returnedDate == null) {
      return reservation.borrowDueDate;
    }
    return this.BorrowReturnedMessage;
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
      
    this.sortReservations();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveReservations() {
    this.electrolibService.getAdminReservations().subscribe(
      reservations => {
        this.reservations = reservations;
        this.showReservationsCriteria();
        this.loaded = true;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.showReservationsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  showReservationsCriteria() {
    let tempRes: Reservation[] = [];

    if (this.isChecked) {

      this.reservations.forEach(res => {
        if (res.isActive === 1) {
          tempRes.push(res);
        }
      });
      this.displayedReservations = tempRes;
    }

    else {
      this.displayedReservations = this.reservations;
    }
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
      this.displayedReservations = [];

      this.reservations.forEach(reservation => {
        if (this.isReservationValid(reservation)) {
          switch (this.selectedSearchBy) {
            case "title":
              if (this.isFieldValid(reservation.book.title)) {
                this.displayedReservations.push(reservation);
              }
              break;
            case "memberNumber":
              if (this.isFieldValid(reservation.user.memberNumber)) {
                this.displayedReservations.push(reservation);
              }
              break;
            case "reservationDate":
              if (this.isFieldValid(reservation.reservationDate.toString())) {
                this.displayedReservations.push(reservation);
              }
              break;
          }
        }
      });
    }
    else {
      this.showReservationsCriteria();
    }
    this.sortReservations();
  }

  //-------------------------------------------------------
  // Tri les réservations
  //-------------------------------------------------------
  sortReservations() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedReservations.sort((a, b) => (a.book.title.toUpperCase() > b.book.title.toUpperCase() ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedReservations.sort((a, b) => (a.user.memberNumber > b.user.memberNumber ? 1 : -1));
          break;
        case "reservationDate":
          this.displayedReservations.sort((a, b) => (a.reservationDate > b.reservationDate ? 1 : -1));
          break;
      }
    }
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedReservations.sort((a, b) => (a.book.title.toUpperCase() < b.book.title.toUpperCase() ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedReservations.sort((a, b) => (a.user.memberNumber < b.user.memberNumber ? 1 : -1));
          break;
        case "reservationDate":
          this.displayedReservations.sort((a, b) => (a.reservationDate < b.reservationDate ? 1 : -1));
          break;
      }
    }
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
  isReservationValid(reservation: Reservation) {
    if (this.isChecked && reservation.isActive === 0) {
      return false;
    }
    return true;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  checkIfLate(reservation: Reservation) {

    if (reservation.borrowDueDate && reservation.borrow.returnedDate == null) {
      const nowDate: Date = new Date();
      const dueDate: Date = new Date(reservation.borrowDueDate);

      if (dueDate && nowDate >= dueDate) {
        return "En retard";
      }
    }

    return "";
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  cancelReservation(reservation: Reservation) {

    this.electrolibService.cancelReservation(reservation).subscribe(
      (response) => {
        console.log('Reservation canceled successfully!', response);
        this.retrieveReservations();
        this.showReservationsCriteria();
      },
      (error) => {
        console.error('Cancel failed:', error);
      }
    );
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
  openConfirmActionReservation(content: any, reservation: Reservation) {
    this.reservation = reservation;
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
  canBeBorrowed(reservation: Reservation) {
    if (reservation.isActive && (reservation.borrow.returnedDate != null || !reservation.borrowMemberNumber)) {
      return true;
    }
    return false;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createBorrowFromReservation(reservation: Reservation) {
    this.electrolibService.createBorrow(reservation.user.idUser, reservation.book.idBook).subscribe(
      (response) => {
          console.log('Borrow created successfully!', response);

          this.electrolibService.cancelReservation(reservation).subscribe(
            (response) => {
              console.log('Reservation cancelled successfully!', response);
              this.retrieveReservations();
              this.showReservationsCriteria();
            },
            (error) => {
              console.error('Cancel failed:', error);
            }
          );
      },
      (error) => {
        console.error('Creation failed:', error);
      }
    );
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
