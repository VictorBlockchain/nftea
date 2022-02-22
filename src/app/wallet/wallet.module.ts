import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    WalletRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule

  ],
  exports: [
    WalletComponent
  ],
  declarations: [
    WalletComponent
  ],
  providers: [
  ],
})
export class WalletModule { }
