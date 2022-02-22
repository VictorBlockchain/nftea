import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { MintComponent } from './mint.component';
import { MintRoutingModule } from './mint-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    MintRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

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
