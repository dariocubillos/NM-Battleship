import { Injectable } from '@angular/core';
import { GameEnd } from '../interfaces/game-end';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  private games: GameEnd[] = [];

  constructor() { }

  setData(game:GameEnd):void {
    this.games.push(game);
  }

  getData():GameEnd[] {
    return this.games;
  }

}
