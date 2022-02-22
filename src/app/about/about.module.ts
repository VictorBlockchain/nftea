import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from '../header/header.component';
import { HeaderModule } from '../header/header.module';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HomeModule } from '../home/home.module';
@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HeaderModule,
    HomeModule

  ],
  exports: [
    AboutComponent,

  ],
  declarations: [
    AboutComponent,
    //HeaderComponent,
  ],
  providers: [
  ],
})
export class AboutModule { }
