import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialUIModule } from './material-ui/material-ui.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TokenInterceptor } from './classes/token.interceptor';
import { WordListComponent } from './pages/word-list/word-list.component';
import { WordCardComponent } from './components/shared/word-card/word-card.component';
import { WordDictionaryCardComponent } from './components/shared/word-dictionary-card/word-dictionary-card.component';

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
    WordListComponent,
    WordCardComponent,
    WordDictionaryCardComponent,
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
