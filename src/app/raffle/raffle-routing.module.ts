import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaffleComponent } from './raffle.component';

const routes: Routes = [
  { path: '', component: RaffleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaffleRoutingModule { }
