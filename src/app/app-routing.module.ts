import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ScoresComponent } from './components/scores/scores.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'board', component: BoardComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'options', component: ScoresComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
