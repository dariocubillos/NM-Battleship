import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BoardSize } from '../../enums/board-size-enum';
import { ShipName } from '../../enums/ship-names-enum';
import { Cordinate } from '../../interfaces/cordinate';
import { Ship } from '../../models/ship.model';
declare var $: any;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild('customTurnsInput') customTurns: ElementRef | undefined;

  ships: Ship[] = [];
  usedCordinates: Cordinate[] =[];
  remainingTurns: number = 0;
  remainingObjetives: number = BoardSize.objectives;
  $: any = $;

  @HostListener('document:click', ['$event'])
  clickout() {
    if (this.remainingTurns === 0){
      setTimeout(() => { $("#initGameModal").modal('show');}, 200);
    }
  }

  constructor() {
    this.setupShips();
  }


  ngAfterViewInit(): void {
    this.showShips(); // for test
    $("#initGameModal").modal('show');
  }

  ngOnInit(): void {

  }
  newGame(){
    this.resetGame();
  }

  resetGame():void {
    this.ships = [];
    this.usedCordinates=[];
    this.remainingTurns = 0;
    this.remainingObjetives = BoardSize.objectives;
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

  saveTurns(turns:number | string):void {
    if (turns !== 0 && turns !== '') {
      this.remainingTurns = Number(turns);
      $("#initGameModal").modal('hide');
    }
  }

  counter(seed: number): Array<any> {
    return new Array(seed);
  }

  clickByUser(positionY: any, positionX: any): void {
    let found= false;
    let shipSelected;
    let removeShipCordinate;
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
    if (!found) {
      document.getElementById(`${positionX}-${positionY}`)?.style.setProperty('background-color','gray');
    }else {
      // remove a cordinate of ship and check if we can cross the ship
    }
    this.checkEnd();
  }

  showShips():void {
    this.ships.forEach(ship => {
      for (let index = 0; index < ship.position.length; index++) {
        const cordinate = ship.position[index];
        document.getElementById(`${cordinate.x}-${cordinate.y}`)?.style.setProperty('background-color',this.getVisualShip(ship.name));
      }
    });
  }

  private cleanBoard():void {
    for (let x = 0; x <= 9; x++) {
      for (let y = 0; y <= 9; y++) {
        document.getElementById(`${x}-${y}`)?.style.setProperty('background-color','rgb(43, 184, 250)');
      }
    }
  }

  private checkEnd(): void {
    if (this.remainingObjetives === 0) {
      console.log('WIN!!!'); // add the win mensage
      this.resetGame();
    }else {
      if (this.remainingTurns === 0) {
        console.log('LOSE!!!'); // add the lose mensage
        this.resetGame();
      }
    }
  }

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

  private addManyShips(nameShip:string, quantity:number): Ship[] {
    let result: Ship[] = [];
    for (let i = 0; i < quantity; i++) {
      let tempShip = {name:nameShip, position: this.getPosition(nameShip)};
      let repeted = false;
      do {
        for (const cordinate of tempShip.position) {
          if (this.checkPlaneXY(this.usedCordinates, cordinate)) {
            console.log("Rejected!!!!!!!!!");
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

  private checkPlaneXY(cordinates: Cordinate[], newCordinate: Cordinate): boolean {
    return cordinates.some(cordinate => cordinate.x === newCordinate.x  && cordinate.y ===  newCordinate.y);
  }

  /**
   *
   * @param min number range
   * @param max number range
   * @returns ramdom number
   */
  private randomIntFromInterval(min:number, max:number):number  {
    min = min < BoardSize.min ? BoardSize.min: min;
    max = max > BoardSize.max ? BoardSize.max: max;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
