import { Component, OnInit } from '@angular/core';
import { GameEnd } from '../../interfaces/game-end';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {

  constructor(private resultService:ScoresService) {
   }

   /**
    *
    * @returns  GameEnd[]
    */
  getScores(): GameEnd[] {
    return this.resultService.getData();
  }

  checkInfinite(turns:number):string{
    return turns === -1 ? '∞': turns.toString();
  }

}
