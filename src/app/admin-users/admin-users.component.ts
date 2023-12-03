import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  users: User[] = [];
  displayedUsers: User[] = [];

  searchField: string = "";
  selectedSearchBy: String = "memberNumber";
  selectedSortBy: String = "ascending";
  desc: boolean = true;
  loaded = false;
  colorSwitch: boolean = false;

  @Output() switchTheme = new EventEmitter<any>();

  constructor(private electrolibService: ElectrolibService, private dataService: DataService) { }

  ngOnInit() {
    if (localStorage.getItem('theme') != 'light') {
      this.colorSwitch = true;
    } else {
      this.colorSwitch = false;
    }

    this.retrieveUsers();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  verifyIfResultFound() {
    if (this.displayedUsers.length == 0 && this.loaded) {
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
  // Change l'ordre de tri
  //-------------------------------------------------------
  changeSortBy(type: String) {
    this.selectedSortBy = type;
  }

  //-------------------------------------------------------
  // Change le type de recherche
  //-------------------------------------------------------
  changeResearchBy(type: String) {
    this.selectedSearchBy = type;
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
      
    this.sortUsers();
  }

  //-------------------------------------------------------
  // Tri les livres
  //-------------------------------------------------------
  sortUsers() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "memberNumber":
          this.displayedUsers.sort((a, b) => (a.memberNumber > b.memberNumber ? 1 : -1));
          break;
        case "name":
          this.displayedUsers.sort((a, b) => (a.lastName.toUpperCase() > b.lastName.toUpperCase() ? 1 : -1));
          break;
        case "roles":
          this.displayedUsers.sort((a, b) => (this.parseRole(a) > this.parseRole(b) ? 1 : -1));
          break;
        case "totalPenalities":
          this.displayedUsers.sort((a, b) => (a.totalPenalities > b.totalPenalities ? 1 : -1));
          break;
        case "registrationDate":
          this.displayedUsers.sort((a, b) => (a.registrationDate > b.registrationDate ? 1 : -1));
          break;
      }
    }
    else {
      switch (this.selectedSearchBy) {
        case "memberNumber":
          this.displayedUsers.sort((a, b) => (a.memberNumber < b.memberNumber ? 1 : -1));
          break;
        case "name":
          this.displayedUsers.sort((a, b) => (a.lastName.toUpperCase() < b.lastName.toUpperCase() ? 1 : -1));
          break;
        case "roles":
          this.displayedUsers.sort((a, b) => (this.parseRole(a) < this.parseRole(b) ? 1 : -1));
          break;
        case "totalPenalities":
          this.displayedUsers.sort((a, b) => (a.totalPenalities < b.totalPenalities ? 1 : -1));
          break;
        case "registrationDate":
          this.displayedUsers.sort((a, b) => (a.registrationDate < b.registrationDate ? 1 : -1));
          break;
      }
    }
  }

  //-------------------------------------------------------
  // Recherche par nom de livre
  //-------------------------------------------------------
  search() {
    if (this.searchField.trim().length > 0) {
      this.displayedUsers = [];
      this.users.forEach(user => {
        switch (this.selectedSearchBy) {

          case "memberNumber":
            if (user.memberNumber.includes(this.searchField)) {
              this.displayedUsers.push(user);
            }
            break;
          case "name":
            if (user.firstName.toUpperCase().includes(this.searchField.toUpperCase()) ||
              user.lastName.toUpperCase().includes(this.searchField.toUpperCase())) {
              this.displayedUsers.push(user);
            }
            break;
        }
      });
    } else {
      this.displayedUsers = this.users;
    }
    this.sortUsers();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveUsers() {
    this.electrolibService.getUsers().subscribe(
      users => {
        this.users = users;
        this.displayedUsers = users;

        this.calculatePenalties();
        this.loaded = true;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  calculatePenalties() {
    this.users.forEach(user => {
      let fee: number = 0;

      this.electrolibService.getBorrowsFromUser(user).subscribe(
        borrows => {
          borrows.forEach(borrow => {
            fee += this.calculateFee(borrow);
          });
          user.totalPenalities = fee;
        }
      );
    });
  }

  //-------------------------------------------------------
  // Fonction créée par Zachary Ethier dans Borrow.ts
  //-------------------------------------------------------
  calculateTime(borrow: Borrow) {
    let dueDate = new Date(borrow.dueDate);
    return Math.round(((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24)) * 100) / 100;;
  }

  //-------------------------------------------------------
  // Fonction créée par Zachary Ethier dans Borrow.ts
  //-------------------------------------------------------
  calculateFee(borrow: Borrow) {
    if (this.calculateTime(borrow) <= 0)
      return Math.ceil((this.calculateTime(borrow) * - 1) / 7) * 2;
    else
      return 0;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  parseRole(user: User) {
    if (user.roles == '["ROLE_ADMIN"]') {
      return "Administrateur";
    }
    return "Membre";
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }
}
