import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Pet Food Calculations';
  dryFoodAmount: number = 0;
  wetFoodAmount: number = 0;
  desiredWetFoodAmount: number = 0;
  isInputFormSubmitted: boolean = false;
  rangeValue: number = 0;
  rangeOptions: number[] = []

  onInputUpdate(event: any) {
    console.log(event)
    this.dryFoodAmount = Number.parseInt((<HTMLInputElement>event.target).value)
  }

  selectOptions = [
    0.5,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4
  ]

  onSelectUpdate(event:any) {
    console.log(event)
    this.wetFoodAmount = Number.parseFloat((<HTMLSelectElement>event.target).value)
    console.log(this.wetFoodAmount)
  }

  isInputFormInvalid() {
    return !(!!this.dryFoodAmount && !!this.wetFoodAmount);
  }

  onSubmitForm() {
    this.isInputFormSubmitted = !!this.dryFoodAmount
    console.log('Submitted!')
    this.rangeOptions = this.selectOptions.slice(0, this.selectOptions.indexOf(this.wetFoodAmount) + 1);
  }

  onRangeUpdate(event: any) {
    this.desiredWetFoodAmount = Number.parseFloat((<HTMLSelectElement>event.target).value)
  }

  getDesiredDryFoodAmount() {
    const wetFoodPart = this.desiredWetFoodAmount / this.wetFoodAmount;
    return Math.round(this.dryFoodAmount - this.dryFoodAmount * wetFoodPart)
  }

}
