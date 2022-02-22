import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { Four04Component } from './four04.component';
import { Four04RoutingModule } from './four04-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    Four04RoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    Four04Component
  ],
  declarations: [
    Four04Component
  ],
  providers: [
  ],
})
export class Four04Module { }
