import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailLivreComponent } from './detail-livre/detail-livre.component';
import { InventoryComponent } from './inventory/inventory.component';
import { DetailsBorrowComponent } from './details-borrow/details-borrow.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { AdminBookComponent } from './admin-book/admin-book.component';
import { ConnectionComponent } from './connection/connection.component';

// Create a routes Array
const routes: Routes = [
  { path:  "detailLivre/:id", component: DetailLivreComponent },
  { path:  "inventaire", component: InventoryComponent },
  //{ path:  "", component:InventoryComponent},
  { path: "detailEmprunt/:id", component:DetailsBorrowComponent},
  { path: "adminInventory", component:AdminInventoryComponent},
  { path: "adminBook", component:AdminBookComponent},
  { path: "", component:ConnectionComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
