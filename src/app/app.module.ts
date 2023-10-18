import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionComponent } from './connection/connection.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProfileComponent } from './profile/profile.component';
import { BorrowComponent } from './borrow/borrow.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { ChatComponent } from './chat/chat.component';
import { DetailsBorrowComponent } from './details-borrow/details-borrow.component';
import { DetailLivreComponent } from './detail-livre/detail-livre.component';
import { RecommendedComponent } from './recommended/recommended.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { BorrowsComponent } from './borrows/borrows.component';
import { BorrowDetailsComponent } from './borrow-details/borrow-details.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { AdminBorrowsComponent } from './admin-borrows/admin-borrows.component';
import { AdminReservationsComponent } from './admin-reservations/admin-reservations.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { HistoryComponent } from './history/history.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    NavbarComponent,
    InventoryComponent,
    ProfileComponent,
    BorrowComponent,
    FavoriteComponent,
    ChatComponent,
    DetailsBorrowComponent,
    DetailLivreComponent,
    RecommendedComponent,
    AdminInventoryComponent,
    AdminNavbarComponent,
    BorrowsComponent,
    BorrowDetailsComponent,
    CreateBookComponent,
    EditBookComponent,
    AdminBorrowsComponent,
    AdminReservationsComponent,
    AdminUsersComponent,
    ToastComponent,
    HistoryComponent,
    ReservationComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
