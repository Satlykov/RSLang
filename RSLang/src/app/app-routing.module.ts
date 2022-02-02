import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioCallGamePageComponent } from './pages/audio-call-game-page/audio-call-game-page.component';
import { AuthorizationPageComponent } from './pages/authorization-page/authorization-page.component';
import { ElectronicBookPageComponent } from './pages/electronic-book-page/electronic-book-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SprintGamePageComponent } from './pages/sprint-game-page/sprint-game-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'authorization', component: AuthorizationPageComponent },
  { path: 'book', component: ElectronicBookPageComponent },
  { path: 'sprint-game', component: SprintGamePageComponent },
  { path: 'audio-call-game', component: AudioCallGamePageComponent },
  { path: 'statistics', component: StatisticsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
