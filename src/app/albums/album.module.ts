import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from '../header/header.component';
import { HeaderModule } from '../header/header.module';
import { AlbumComponent } from './album.component';
import { AlbumRoutingModule } from './album-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
@NgModule({
  imports: [
    CommonModule,
    AlbumRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule

  ],
  exports: [
    AlbumComponent,

  ],
  declarations: [
    AlbumComponent,
    //HeaderComponent,
  ],
  providers: [
  ],
})
export class AlbumModule { }
