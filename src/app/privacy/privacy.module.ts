import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { PrivacyComponent } from './privacy.component';
import { PrivacyRoutingModule } from './privacy-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    PrivacyRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    PrivacyComponent
  ],
  declarations: [
    PrivacyComponent
  ],
  providers: [
  ],
})
export class PrivacyModule { }
