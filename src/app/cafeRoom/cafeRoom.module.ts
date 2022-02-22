import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { CafeRoomComponent } from './cafeRoom.component';
import { CafeRoomRoutingModule } from './cafeRoom-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';


@NgModule({
  imports: [
    CommonModule,
    CafeRoomRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule
  ],
  exports: [
    CafeRoomComponent
  ],
  declarations: [
    CafeRoomComponent
  ],
  providers: [
  ],
})
export class CafeRoomModule { }
