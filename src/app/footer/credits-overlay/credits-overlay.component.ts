import { Component, OnInit } from '@angular/core';
import {ConnectionPositionPair} from '@angular/cdk/overlay';

@Component({
  selector: 'app-credits-overlay',
  templateUrl: './credits-overlay.component.html',
  styleUrls: ['./credits-overlay.component.css']
})
export class CreditsOverlayComponent implements OnInit {

  isOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  positionPairs: ConnectionPositionPair[] = [
    {
      offsetY: -30,
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom'
    },
  ];
}
