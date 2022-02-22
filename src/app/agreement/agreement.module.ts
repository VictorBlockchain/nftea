import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AgreementComponent } from './agreement.component';
import { AgreementRoutingModule } from './agreement-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    AgreementRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    AgreementComponent
  ],
  declarations: [
    AgreementComponent
  ],
  providers: [
  ],
})
export class AgreementModule { }
