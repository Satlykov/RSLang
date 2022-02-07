import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialUIModule } from './material-ui/material-ui.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AuthorizationPageComponent } from './pages/authorization-page/authorization-page.component';
import { ElectronicBookPageComponent } from './pages/electronic-book-page/electronic-book-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { AudioCallGamePageComponent } from './pages/audio-call-game-page/audio-call-game-page.component';
import { SprintGamePageComponent } from './pages/sprint-game-page/sprint-game-page.component';
import { HeaderComponent } from './components/core/header/header.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { MainContentComponent } from './components/core/main-content/main-content.component';
import { ExitComponent } from './pages/exit/exit.component';
import { AboutTeamComponent } from './pages/about-team/about-team.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AuthorizationPageComponent,
    ElectronicBookPageComponent,
    StatisticsPageComponent,
    AudioCallGamePageComponent,
    SprintGamePageComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    ExitComponent,
    AboutTeamComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialUIModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
