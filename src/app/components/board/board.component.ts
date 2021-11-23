import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BoardSize } from '../../enums/board-size-enum';
import { GameStatus } from '../../enums/game-status.enum';
import { ShipName } from '../../enums/ship-names-enum';
import { Cordinate } from '../../interfaces/cordinate';
import { Ship } from '../../interfaces/ship.model';
import { ScoresService } from '../../services/scores.service';
import { ShipIndicatorComponent } from '../ship-indicator/ship-indicator.component';
declare var $: any;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements  AfterViewInit {

  @ViewChild('shipIndicator') shipIndicator: ShipIndicatorComponent | undefined;
  @ViewChild('customTurnsInput') customTurns: ElementRef | undefined;

  gameStatus: GameStatus = GameStatus.notCompleted;
  ships: Ship[] = [];
  usedCordinates: Cordinate[] =[];
  remainingTurns: number = 0;
  remainingObjetives: number = BoardSize.objectives;
  $: any = $;

  @HostListener('document:click', ['$event'])
  clickout(): void {
    if (this.remainingTurns === 0){
      setTimeout(() => { $("#initGameModal")?.modal('show');}, 200);
    }
  }

  constructor(private resultService:ScoresService) {
    this.setupShips();
  }

  ngAfterViewInit(): void {
    if ($("#initGameModal").modal !== undefined) {
      $("#initGameModal").modal('show');
    }
  }

  newGame():void {
    this.resetGame();
  }

  resetGame():void {
    this.ships = [];
    this.usedCordinates=[];
    this.remainingTurns = 0;
    this.remainingObjetives = BoardSize.objectives;
    this.shipIndicator?.resetShips();
    this.cleanBoard();
    this.setupShips();
  }

  setupShips():void {
    this.ships.push({name: ShipName.aircraftCarrier, position: this.getPosition(ShipName.aircraftCarrier)});
    this.usedCordinates.push(...this.ships[0].position);
    this.ships.push(...this.addManyShips(ShipName.cruise, 2));
    this.ships.push(...this.addManyShips(ShipName.destroyers, 3));
    this.ships.push(...this.addManyShips(ShipName.frigate, 4));
  }

  /**
   *
   * @param turns
   */
  saveTurns(turns:number | string):void {
    if (turns !== 0 && turns !== '') {
      this.remainingTurns = Number(turns);
      $("#initGameModal")?.modal('hide');
    }
  }

  /**
   *
   * @param seed
   * @returns Array<any>
   */
  counter(seed: number): Array<any> {
    return new Array(seed);
  }

  /**
   *
   * @param positionY
   * @param positionX
   */
  clickByUser(positionY: any, positionX: any): void {
    let found = false;
    let shipSelected: Ship = {
      name: '',
      position: []
    };
    let removeShipCordinate: Cordinate = {
      x: 0,
      y: 0
    };
    if (this.remainingTurns > -1) {
      this.remainingTurns--;
    }
    this.ships.forEach(ship => {
      for (let index = 0; index < ship.position.length; index++) {
        const cordinate = ship.position[index];
        if (positionY === cordinate.y && positionX === cordinate.x) {
          found = true;
          shipSelected = ship;
          removeShipCordinate = ship.position[index];
          this.remainingObjetives--;
          document.getElementById(`${cordinate.x}-${cordinate.y}`)?.style.setProperty('background-color','red');
        }
      }
    });
    if (!found && document.getElementById(`${positionX}-${positionY}`)?.style.getPropertyValue('background-color') !== 'red') {
      document.getElementById(`${positionX}-${positionY}`)?.style.setProperty('background-color','gray');
    }else {
      this.removeShipCordinate(shipSelected, removeShipCordinate);
    }
    this.checkEnd();
  }

  /**
   * Shows the ships when surrendering
   */
  showShips():void {
    this.cleanBoard();
    this.ships.forEach(ship => {
      for (let index = 0; index < ship.position.length; index++) {
        const cordinate = ship.position[index];
        document.getElementById(`${cordinate.x}-${cordinate.y}`)?.style.setProperty('background-color',this.getVisualShip(ship.name));
      }
    });
  }

  /**
   *
   * @param shipSelected
   * @param removeShipCordinate
   */
  private removeShipCordinate(shipSelected: Ship, removeShipCordinate: Cordinate ):void  {
    const indexShip = this.ships.indexOf(shipSelected, 0);
    const indexCortinate = this.ships[indexShip]?.position.indexOf(removeShipCordinate,0);
    if (indexCortinate > -1) {
      this.ships[indexShip].position.splice(indexCortinate, 1);
    }
    if (this.ships[indexShip]?.position.length === 0) {
      this.shipIndicator?.crossOutImage(this.ships[indexShip].name)
    }
  }

  /**
   * The board is cleaned
   */
  private cleanBoard():void {
    for (let x = 0; x <= 9; x++) {
      for (let y = 0; y <= 9; y++) {
        document.getElementById(`${x}-${y}`)?.style.setProperty('background-color','rgb(43, 184, 250)');
      }
    }
  }

  /**
   * Check if the game is finished
   */
  private checkEnd(): void {
    if (this.remainingObjetives === 0) {
      this.gameStatus = GameStatus.win;
      this.saveScore();
      console.log(this.resultService.getData());
      this.resetGame();
    }else {
      if (this.remainingTurns === 0) {
        this.gameStatus = GameStatus.lose;
        this.saveScore();
        console.log(this.resultService.getData());
        this.resetGame();
      }
    }
  }

  /**
   * save game in service
   */
  private saveScore(): void {
    this.resultService.setData(
      {
        id: this.resultService.getData().length === 0 ? 0 : this.resultService.getData().length-1,
        result: this.gameStatus,
        remainingTurns: this.remainingTurns,
        date: new Date().toLocaleString()
      }
    );
  }

  /**
   *
   * @param shipName
   * @returns string
   */
  private getVisualShip(shipName:string): string {
    switch (shipName) {
      case ShipName.aircraftCarrier:
      return 'green';

      case ShipName.cruise:
      return 'blue';

      case ShipName.destroyers:
      return 'yellow';

      default:
      return 'pink';
    }
  }

  /**
   *
   * @param nameShip
   * @param quantity
   * @returns Ship[]
   */
  private addManyShips(nameShip:string, quantity:number): Ship[] {
    let result: Ship[] = [];
    for (let i = 0; i < quantity; i++) {
      let tempShip = {name:nameShip, position: this.getPosition(nameShip)};
      let repeted = false;
      do {
        for (const cordinate of tempShip.position) {
          if (this.checkPlaneXY(this.usedCordinates, cordinate)) {
            repeted = true;
            tempShip ={name:nameShip, position: this.getPosition(nameShip)};
          }else{
            repeted = false;
          }
        }
      }
      while (repeted);
      this.usedCordinates.push(...tempShip.position);
      result.push(tempShip);
    }
    return result;
  }

  /**
   *
   * @param shipName
   * @returns  Cordinate[]
   */
  private getPosition(shipName: string): Cordinate[] {
    let result: Cordinate[] = [];

    switch (shipName) {
      case ShipName.aircraftCarrier:
        result.push(...this.getCoordinates(4));
      break;

      case ShipName.cruise:
        result.push(...this.getCoordinates(3));
      break;

      case ShipName.destroyers:
        result.push(...this.getCoordinates(2));
      break;

      default:
        result.push(...this.getCoordinates(1));
      break;
    }
    return result;
  }

  /**
   *
   * @param shipSize
   * @returns Cordinate[]
   */
  private getCoordinates(shipSize: number): Cordinate[] {
    let result: Cordinate[] = []
    result.push({
      x:this.randomIntFromInterval(BoardSize.min,BoardSize.max),
      y:this.randomIntFromInterval(BoardSize.min,BoardSize.max)
      });
    if (result[0].x + (shipSize--) < BoardSize.max) {
      for (let i = 0; i < shipSize; i++) {
        result.push({x: (result[i].x+1), y: result[0].y});
      }
    }else{
      for (let i = 0; i < shipSize; i++) {
        if (result[0].y + shipSize < BoardSize.max) {
          result.push({x: result[0].x, y: (result[i].y+1)});
        }
        else{
          result.push({x: result[0].x, y: (result[i].y-1)});
        }
      }
    }
    return result;
  }

  /**
   *
   * @param cordinates actual positions
   * @param newCordinate new element to add
   * @returns boolean
   */
  private checkPlaneXY(cordinates: Cordinate[], newCordinate: Cordinate): boolean {
    return cordinates.some(cordinate => cordinate.x === newCordinate.x  && cordinate.y ===  newCordinate.y);
  }

  /**
   *
   * @param min number range
   * @param max number range
   * @returns  number
   */
  private randomIntFromInterval(min:number, max:number):number  {
    min = min < BoardSize.min ? BoardSize.min: min;
    max = max > BoardSize.max ? BoardSize.max: max;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
