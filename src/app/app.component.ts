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

  pet: /*'cat' | 'dog' | ''*/string = '';

  caloriesNumCalculated: number = 0;
  caloriesCalculationSkipped: boolean = false;

  isInputFormSubmitted: boolean = false;
  rangeValue: number = 0;
  rangeOptions: number[] = [];

  onPetSelected(petType: string) {
    // console.log(event);
    this.pet = petType;
    console.log(`Pet type from App Component: ${this.pet}`);
  }

  onCaloriesCalculated(caloriesNum: number) {
    this.caloriesNumCalculated = caloriesNum;
  }

  onCaloriesSkipped(shouldSkipCalories: boolean) {
    this.caloriesCalculationSkipped = shouldSkipCalories;
  }

  isFoodSectionDisabled() {

  }

  // isInputFormInvalid() {
  //   return !(!!this.dryFoodAmount && !!this.wetFoodAmount);
  // }
  //
  // onSubmitForm() {
  //   this.isInputFormSubmitted = !!this.dryFoodAmount
  //   console.log('Submitted!')
  //   this.rangeOptions = this.selectOptions.slice(0, this.selectOptions.indexOf(this.wetFoodAmount) + 1);
  // }
  //
  // onRangeUpdate(event: any) {
  //   this.desiredWetFoodAmount = Number.parseFloat((<HTMLSelectElement>event.target).value)
  // }
  //
  // getDesiredDryFoodAmount() {
  //   const wetFoodPart = this.desiredWetFoodAmount / this.wetFoodAmount;
  //   return Math.round(this.dryFoodAmount - this.dryFoodAmount * wetFoodPart)
  // }

}
