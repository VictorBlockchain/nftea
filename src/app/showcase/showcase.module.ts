import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { ShowcaseComponent } from './showcase.component';
import { ShowcaseRoutingModule } from './showcase-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule,
  ],
  exports: [
    ShowcaseComponent
  ],
  declarations: [
    ShowcaseComponent
  ],
  providers: [
  ],
})
export class ShowcaseModule { }
