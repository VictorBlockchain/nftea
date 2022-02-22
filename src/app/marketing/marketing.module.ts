import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { MarketingComponent } from './marketing.component';
import { MarketingRoutingModule } from './marketing-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    MarketingRoutingModule,
    HeaderModule,
    HomeModule
  ],
  exports: [
    MarketingComponent
  ],
  declarations: [
    MarketingComponent
  ],
  providers: [
  ],
})
export class MarketingModule { }
