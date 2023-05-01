import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { MarkerMapComponent } from 'src/componenets/marker-map/marker-map.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    MarkerMapComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
