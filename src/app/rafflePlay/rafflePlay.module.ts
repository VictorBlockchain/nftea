import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { RafflePlayComponent } from './rafflePlay.component';
import { RafflePlayRoutingModule } from './rafflePlay-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    RafflePlayRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    RafflePlayComponent
  ],
  declarations: [
    RafflePlayComponent
  ],
  providers: [
  ],
})
export class RafflePlayModule { }
