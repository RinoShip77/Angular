import { Component, EventEmitter, Output } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Book } from '../model/Book';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent {

  visible = false;
  user: User = new User();
  books: Book[] = new Array();

  constructor(private electrolibSrv: ElectrolibService) { }

  ngOnInit() {

    this.retrieveBooks();
    console.log(this.books);
  }

  //-------------------------------------------------------
  // Récupère tous les livres présents en base de données
  //-------------------------------------------------------
  retrieveBooks(filter?: number[], search?: string) {
    this.electrolibSrv.getBooks(filter, search).subscribe(
      books => {
        this.books = books;
      }
    );
  }

  //-------------------------------------------------------
  // Affiche l'inventaire admin
  //-------------------------------------------------------
  onAdminInventory(user: User) {
    this.visible = true;
    this.user = user;
  }

  //-------------------------------------------------------
  // Déconnecte l'admin
  //-------------------------------------------------------
  onDisconnect(user: User) {
    this.visible = false;
  }
}
