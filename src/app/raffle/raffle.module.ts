import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { RaffleComponent } from './raffle.component';
import { RaffleRoutingModule } from './raffle-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    RaffleRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    RaffleComponent
  ],
  declarations: [
    RaffleComponent
  ],
  providers: [
  ],
})
export class RaffleModule { }
