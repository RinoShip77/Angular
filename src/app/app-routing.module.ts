import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailLivreComponent } from './detail-livre/detail-livre.component';
import { InventoryComponent } from './inventory/inventory.component';
import { DetailsBorrowComponent } from './details-borrow/details-borrow.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { ConnectionComponent } from './connection/connection.component';
import { BorrowDetailsComponent } from './borrow-details/borrow-details.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { BorrowsComponent } from './borrows/borrows.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { AdminBorrowsComponent } from './admin-borrows/admin-borrows.component';
import { AdminReservationsComponent } from './admin-reservations/admin-reservations.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RecommendedComponent } from './recommended/recommended.component';
import { CreateBorrowComponent } from './create-borrow/create-borrow.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AboutComponent } from './about/about.component';
import { ShareComponent } from './share/share.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminShareComponent } from './admin-share/admin-share.component';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { PageRecommendedComponent } from './page-recommended/page-recommended.component';

// Create a routes Array
const routes: Routes = [
  { path: "detailLivre/:id", component: DetailLivreComponent },
  { path: "inventory", component: InventoryComponent },
  { path: "adminInventory", component: AdminInventoryComponent },
  { path: "detailEmprunt/:id", component: DetailsBorrowComponent },
  { path: "adminInventory", component: AdminInventoryComponent },
  { path: "", component: ConnectionComponent },
  { path: "borrows", component: BorrowsComponent },
  { path: "borrowDetails/:id", component: BorrowDetailsComponent },
  { path: "history", component: HistoryComponent },
  { path: "reservations", component: ReservationComponent },
  { path: "profile", component: ProfileComponent },
  { path: "profile/:id", component: ProfileComponent },
  { path: "createBook", component: CreateBookComponent },
  { path: "editBook/:id", component: EditBookComponent },
  { path: "adminBorrows", component: AdminBorrowsComponent },
  { path: "adminReservations", component: AdminReservationsComponent },
  { path: "adminUsers", component: AdminUsersComponent },
  { path:"recommended",component:RecommendedComponent},
  { path: "create-borrow", component:CreateBorrowComponent},
  { path: "create-user", component:CreateUserComponent},
  { path:"about",component:AboutComponent},
  { path:"share",component:ShareComponent},
  { path:"payment",component:PaymentComponent},
  { path:"adminShare",component:AdminShareComponent},
  { path: "create-reservation", component:CreateReservationComponent},
  { path: "pageRecommendation",component:PageRecommendedComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
