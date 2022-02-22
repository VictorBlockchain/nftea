import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { SupportComponent } from './support.component';
import { SupportRoutingModule } from './support-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    SupportRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    SupportComponent
  ],
  declarations: [
    SupportComponent
  ],
  providers: [
  ],
})
export class SupportModule { }
