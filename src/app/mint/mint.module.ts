import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderModule } from '../header/header.module';
import { MintComponent } from './mint.component';
import { MintRoutingModule } from './mint-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    MintRoutingModule,
    ReactiveFormsModule,
    HeaderModule

  ],
  exports: [
    MintComponent
  ],
  declarations: [
    MintComponent
  ],
  providers: [
  ],
})
export class MintModule { }
