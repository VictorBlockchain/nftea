import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { EmailComponent } from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    EmailRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    EmailComponent
  ],
  declarations: [
    EmailComponent
  ],
  providers: [
  ],
})
export class EmailModule { }
