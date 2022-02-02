import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AuthorizationPageComponent } from './pages/authorization-page/authorization-page.component';
import { ElectronicBookPageComponent } from './pages/electronic-book-page/electronic-book-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { AudioCallGamePageComponent } from './pages/audio-call-game-page/audio-call-game-page.component';
import { SprintGamePageComponent } from './pages/sprint-game-page/sprint-game-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AuthorizationPageComponent,
    ElectronicBookPageComponent,
    StatisticsPageComponent,
    AudioCallGamePageComponent,
    SprintGamePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
