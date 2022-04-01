import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { CafeComponent } from './cafe.component';
import { CafeRoutingModule } from './cafe-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    CafeRoutingModule,
    HeaderModule,
    HomeModule,

  ],
  exports: [
    CafeComponent
  ],
  declarations: [
    CafeComponent
  ],
  providers: [
  ],
})
export class CafeModule { }
