import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import { HeaderModule } from './header/header.module';
import { StartComponent } from './start/start.component';
import { StartModule } from './start/start.module';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { AboutModule } from './about/about.module';
import { SideComponent } from './side/side.component';
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSummernoteModule } from 'ngx-summernote';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AngMusicPlayerModule } from  'ang-music-player';

@NgModule({
  declarations: [
    AppComponent,
    //HeaderComponent,
    SideComponent,
    //HomeComponent
    //AboutComponent
  ],
  imports: [
    AngMusicPlayerModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSummernoteModule,
    //HeaderModule,
    StartModule
  ],
  exports:[
    //AboutComponent
    //HeaderComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [DeviceDetectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
