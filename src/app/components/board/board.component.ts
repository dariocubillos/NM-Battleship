import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BoardSize } from '../../enums/board-size-enum';
import { ShipName } from '../../enums/ship-names-enum';
import { Cordinate } from '../../interfaces/cordinate';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {

  ships: Ship[] = [];
  usedCordinates: Cordinate[] =[];

  constructor() {


    this.ships.push({name: ShipName.aircraftCarrier, position: this.getPosition(ShipName.aircraftCarrier)});

    this.usedCordinates.push(...this.ships[0].position);

    this.ships.push(...this.addManyShips(ShipName.cruise, 2));

    this.ships.push(...this.addManyShips(ShipName.destroyers, 3));

    this.ships.push(...this.addManyShips(ShipName.frigate, 4));

    console.log(this.ships);



  }


  ngAfterViewInit(): void {

    // this.showShips();
  }

  ngOnInit(): void {

  }



  private showShips():void {
    this.ships.forEach(ship => {
      for (let index = 0; index < ship.position.length; index++) {
        const cordinate = ship.position[index];
        document.getElementById(`${cordinate.y}-${cordinate.x}`)?.style.setProperty('background-color',this.getVisualShip(ship.name));
      }
    });
  }


  counter(seed: number) {
    return new Array(seed);
  }

  clickByUser(positionY: any, positionX: any): void {
    this.ships.forEach(ship => {
      for (let index = 0; index < ship.position.length; index++) {
        const cordinate = ship.position[index];
        if (positionY === cordinate.y && positionX === cordinate.x) {
          document.getElementById(`${cordinate.x}-${cordinate.y}`)?.style.setProperty('background-color',this.getVisualShip(ship.name));
        }
      }
    });
  }

  private getVisualShip(shipName:string):string {
    switch (shipName) {
      case ShipName.aircraftCarrier:
      return 'red';

      case ShipName.cruise:
      return 'blue';

      case ShipName.destroyers:
      return 'yellow';

      default:
      return 'pink';
    }
  }

  private addManyShips(nameShip:string, quantity:number):Ship[]{
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


  private randomChoice(): boolean{
    return Math.random() < 0.5 ;
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
