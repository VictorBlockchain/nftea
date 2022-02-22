import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    ProfileRoutingModule,
    HeaderModule,
    HomeModule,

  ],
  exports: [
    ProfileComponent
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
  ],
})
export class ProfileModule { }
