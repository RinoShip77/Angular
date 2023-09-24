import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../model/User';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
  visible = false;
  user: User = new User();

  @Output() openInventory = new EventEmitter<User>();

  constructor(){
    
  }

  //---------------------------------
  // Function to display every book in the database
  //---------------------------------
  onFavorite(user: User) {
    this.visible = true;
    this.user = user;
  }

  //---------------------------------
  // Open the inventory of this user
  //---------------------------------
  displayInventory() {
    this.visible = false;
    this.openInventory.emit(this.user);
  }
}
