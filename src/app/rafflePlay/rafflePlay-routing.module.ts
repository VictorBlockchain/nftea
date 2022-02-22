import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RafflePlayComponent } from './rafflePlay.component';

const routes: Routes = [
  { path: '', component: RafflePlayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RafflePlayRoutingModule { }
