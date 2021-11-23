import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShipName } from '../../enums/ship-names-enum';

@Component({
  selector: 'app-ship-indicator',
  templateUrl: './ship-indicator.component.html',
  styleUrls: ['./ship-indicator.component.scss']
})
export class ShipIndicatorComponent {

  @ViewChild('aircraftDiv') aircraf: ElementRef | undefined;

  constructor() { }

  crossOutImage(shipName:string):void {
    switch (shipName) {
      case ShipName.aircraftCarrier:
        this.aircraf?.nativeElement.classList.add('crossed');
      break;

      case ShipName.cruise:
        this.crossInShipDiv(document.getElementsByClassName('crusierDiv'));
      break;

      case ShipName.destroyers:
        this.crossInShipDiv(document.getElementsByClassName('destroyerDiv'));
      break;

      default:
        this.crossInShipDiv(document.getElementsByClassName('frigateDiv'));
      break;
    }
  }

  resetShips():void {
    this.aircraf?.nativeElement.classList.remove('crossed');
    this.crossInShipDiv(document.getElementsByClassName('crusierDiv'), false);
    this.crossInShipDiv(document.getElementsByClassName('destroyerDiv'), false);
    this.crossInShipDiv(document.getElementsByClassName('frigateDiv'), false);
  }

  private crossInShipDiv(arrayDivs:HTMLCollectionOf<Element>, addCross:boolean = true):void {
    for (let i = 0; i < arrayDivs.length; i++) {
      if (!arrayDivs[i].classList.contains('crossed') && addCross) {
        arrayDivs[i].classList.add('crossed');
        break;
      }
      if(!addCross){
        arrayDivs[i].classList.remove('crossed');
      }
    }
  }
}
