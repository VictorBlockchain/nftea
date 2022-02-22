import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Four04Component } from './four04.component';

const routes: Routes = [
  { path: '', component: Four04Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Four04RoutingModule { }
