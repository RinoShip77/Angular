import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionComponent } from './connection/connection.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
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

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    NavbarComponent,
    FooterComponent,
    InventoryComponent,
    ProfileComponent,
    BorrowComponent,
    FavoriteComponent,
    ChatComponent,
    DetailsBorrowComponent,
    DetailLivreComponent,
    RecommendedComponent,
    AdminInventoryComponent,
    AdminNavbarComponent
    BorrowsComponent,
    BorrowDetailsComponent
  ],
  imports: [
    
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
