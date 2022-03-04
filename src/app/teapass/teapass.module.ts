import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { TeapassComponent } from './teapass.component';
import { TeapassRoutingModule } from './teapass-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';


@NgModule({
  imports: [
    CommonModule,
    TeapassRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule
  ],
  exports: [
    TeapassComponent
  ],
  declarations: [
    TeapassComponent
  ],
  providers: [
  ],
})
export class TeapassModule { }
