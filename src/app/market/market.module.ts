import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { MarketComponent } from './market.component';
import { MarketRoutingModule } from './market-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    MarketComponent
  ],
  declarations: [
    MarketComponent
  ],
  providers: [
  ],
})
export class MarketModule { }
