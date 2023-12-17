import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit() {

  }

  pet: string = '';

  caloriesNumCalculated: number = 0;
  caloriesCalculationSkipped: boolean = false;

  isInputFormSubmitted: boolean = false;
  rangeValue: number = 0;
  rangeOptions: number[] = [];

  onPetSelected(petType: string) {
    this.pet = petType;
  }

  onCaloriesCalculated(caloriesNum: number) {
    this.caloriesNumCalculated = caloriesNum;
  }
}
