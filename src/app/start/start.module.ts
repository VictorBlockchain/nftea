import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from '../header/header.component';
import { StartComponent } from './start.component';
import { StartRoutingModule } from './start-routing.module';

@NgModule({
  imports: [
    CommonModule,
    StartRoutingModule,
    ReactiveFormsModule,

  ],
  exports: [
    StartComponent
  ],
  declarations: [
    StartComponent
  ],
  providers: [
  ],
})
export class StartModule { }
