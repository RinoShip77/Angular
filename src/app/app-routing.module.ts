import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailLivreComponent } from './detail-livre/detail-livre.component';
import { InventoryComponent } from './inventory/inventory.component';

// Create a routes Array
const routes: Routes = [
  { path:  "detailLivre", component: DetailLivreComponent },
  { path:  "inventaire", component: InventoryComponent },
  { path:  "", component:InventoryComponent}
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
