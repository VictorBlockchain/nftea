import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { CreateComponent } from './create.component';
import { CreateRoutingModule } from './create-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    CreateRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule,
  ],
  exports: [
    CreateComponent
  ],
  declarations: [
    CreateComponent
  ],
  providers: [
  ],
})
export class CreateModule { }
