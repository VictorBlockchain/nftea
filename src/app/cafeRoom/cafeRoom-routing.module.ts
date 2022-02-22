import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CafeRoomComponent } from './cafeRoom.component';

const routes: Routes = [
  { path: '', component: CafeRoomComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CafeRoomRoutingModule { }
