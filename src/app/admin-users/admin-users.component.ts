import { Component } from '@angular/core';
import { User } from '../model/User';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  users: User[] = [];
  displayedUsers: User[] = [];

  constructor(private electrolibService: ElectrolibService) { }

  ngOnInit() {
    this.retrieveUsers();
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
}
