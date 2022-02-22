import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from '../header/header.component';
import { HeaderModule } from '../header/header.module';
import { ReferComponent } from './refer.component';
import { ReferRoutingModule } from './refer-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
@NgModule({
  imports: [
    CommonModule,
    ReferRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule

  ],
  exports: [
    ReferComponent,

  ],
  declarations: [
    ReferComponent,
    //HeaderComponent,
  ],
  providers: [
  ],
})
export class ReferModule { }
