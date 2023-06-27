import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ButtonPlayComponent } from './button-play.component';
import { AudioService } from './audio.service';

@NgModule({
  imports: [BrowserModule, FormsModule, BrowserAnimationsModule],
  declarations: [AppComponent, ButtonPlayComponent],
  bootstrap: [AppComponent],
  providers: [AudioService],
})
export class AppModule {}
