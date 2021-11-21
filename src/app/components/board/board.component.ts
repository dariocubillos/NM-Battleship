import { Component, OnInit } from '@angular/core';
import { BoardSize } from '../../enums/board-size-enum';
import { ShipName } from '../../enums/ship-names-enum';
import { Cordinates } from '../../interfaces/cordinates';
import { Ship } from '../../models/ship.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  ships: Ship[] = [];
  usedCordinates: Cordinates[] =[];

  constructor() {

    const rndInt = this.randomIntFromInterval(0, 9)

    this.ships.push({name: ShipName.aircraftCarrier, position:this.getPosition(ShipName.aircraftCarrier)});




  }

  ngOnInit(): void {

  }




  counter(seed: number) {
    return new Array(seed);
  }

  clickByUser(positionX: any, positionY: any): void {


  }

  private getPosition(shipName: string): Cordinates[] {

    let result: Cordinates[] = []

    switch (shipName) {
      case ShipName.aircraftCarrier:
        console.log('s');

      break;

      case ShipName.cruise:
        console.log('d');
      break;

      case ShipName.destroyers:
        console.log('x');
      break;

      default:
      break;
    }

    return result;

  }


  private getCoordinates(shipSize:number){

    let result: Cordinates[] = []


    for (let index = 0; index < shipSize; index++) {

      if (result.length > 0) {

        if (result.length > 1) { // Make sure that the coordinates do not cross each other.

        } else {
          // result.push({x:}); // To be continuous in the consequent position of the ship
        }

      } else {
        result.push(
          {
          x:this.randomIntFromInterval(BoardSize.min,BoardSize.max),
          y:this.randomIntFromInterval(BoardSize.min,BoardSize.max)
          }
        );
      }
    }

    return result;
  }

  /**
   *
   * @param min number range
   * @param max number range
   * @returns ramdom number
   */
  private randomIntFromInterval(min:number, max:number):number  {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

}
