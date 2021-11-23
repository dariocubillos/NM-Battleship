import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ScoresComponent } from './components/scores/scores.component';
import { OptionsComponent } from './components/options/options.component';
import { ShipIndicatorComponent } from './components/ship-indicator/ship-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MainMenuComponent,
    ScoresComponent,
    OptionsComponent,
    ShipIndicatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
