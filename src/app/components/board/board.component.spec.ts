import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipIndicatorComponent } from '../ship-indicator/ship-indicator.component';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardComponent, ShipIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be ships', () => {
    component.newGame();
    expect(component.ships.length > 0).toBeTrue();
  });

  it('should be ships 10', () => {
    component.newGame();
    expect(component.ships.length === 10).toBeTrue();
  });

  it('should be ships on reset', () => {
    component.resetGame();
    expect(component.ships.length === 10).toBeTrue();
  });

});
