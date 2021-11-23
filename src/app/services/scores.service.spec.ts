import { TestBed } from '@angular/core/testing';
import { GameStatus } from '../enums/game-status.enum';

import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service.getData().length === 0).toBeTrue();
  });

  it('should be created', () => {
    service.setData({id:1, result: GameStatus.win,
      remainingTurns: 55,
      date: new Date().toLocaleString()});
    expect(service.getData().length > 0).toBeTrue();
  });
});
