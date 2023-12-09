import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-section-calories',
  templateUrl: './section-calories.component.html',
  styleUrls: ['./section-calories.component.css']
})

export class SectionCaloriesComponent implements OnInit {
  @Output() petSelected = new EventEmitter<string>();
  @Output() caloriesCalculated = new EventEmitter<number>();
  @Output() caloriesSkipped = new EventEmitter<boolean>();

  petTypeSelected: string = ''
  petOptions: string[] = [
    'Cat',
    'Dog'
  ];
  bcsOptions: number[] = Array.from({length: 9}, (_, i) => i + 1);
  currentBcs: number = 0;
  targetBcs: number = 0;
  currentWeight: number = 0;
  targetWeight: number = 0;
  caloriesNumCalculated: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onPetUpdate(event: any) {
    console.log(event);
    // this.petTypeSelected = (<HTMLSelectElement>event.target).value.toLowerCase();
    console.log(`Pet Type from section-calories: ${this.petTypeSelected}`);
    this.petSelected.emit(this.petTypeSelected);
    if(this.isCaloriesFormValid()) {
      console.log('Calories submitted!')
      this.caloriesNumCalculated = this.getCalories();
      console.log(this.caloriesNumCalculated)
      this.caloriesCalculated.emit(this.caloriesNumCalculated)
    }
  }

  onCurrentBcsSelectUpdate(event: any) {
    console.log(event);
    // this.currentBcs = Number.parseFloat((<HTMLSelectElement>event.target).value);
    console.log('Current BCS: ', this.currentBcs);
    if(this.isCaloriesFormValid()) {
      console.log('Calories submitted!')
      this.caloriesNumCalculated = this.getCalories();
      console.log(this.caloriesNumCalculated)
      this.caloriesCalculated.emit(this.caloriesNumCalculated)
    }
  }

  onTargetBcsSelectUpdate(event: any) {
    console.log(event);
    console.log('Target BCS: ', this.targetBcs);
    if(this.isCaloriesFormValid()) {
      console.log('Calories submitted!')
      this.caloriesNumCalculated = this.getCalories();
      console.log(this.caloriesNumCalculated)
      this.caloriesCalculated.emit(this.caloriesNumCalculated)
    }
  }

  onCurrentWeightUpdate(event: any) {
    console.log(event);
    this.currentWeight = Number.parseFloat((<HTMLSelectElement>event.target).value);
    console.log(this.currentWeight);
    if(this.isCaloriesFormValid()) {
      console.log('Calories submitted!')
      this.caloriesNumCalculated = this.getCalories();
      console.log(this.caloriesNumCalculated)
      this.caloriesCalculated.emit(this.caloriesNumCalculated)
    }
  }

  isCaloriesFormInvalid() {
    return !(
      !!this.petTypeSelected
      && !!this.currentBcs
      && !!this.targetBcs
      && !!this.currentWeight
    )
  }

  isCaloriesFormValid() {
    return (
      !!this.petTypeSelected
      && !!this.currentBcs
      && !!this.targetBcs
      && !!this.currentWeight
    )
  }

  onCaloriesFormSubmit() {
    console.log('Calories submitted!')
    this.caloriesNumCalculated = this.getCalories();
    console.log(this.caloriesNumCalculated)
    this.caloriesCalculated.emit(this.caloriesNumCalculated)
  }

  onSkipCaloriesForm() {
    this.caloriesSkipped.emit(true);
  }

  getCalories() {
    let calories = 0;
    let bcsMultiplier = 1 + (this.targetBcs - this.currentBcs) * 0.1;
    console.log(`BCS MULTIPLIER: ${bcsMultiplier}`);
    const rawTargetWeight = bcsMultiplier * this.currentWeight;
    this.targetWeight = Math.round((rawTargetWeight + Number.EPSILON) * 100) / 100
    console.log('targetWeight', this.targetWeight)
    switch(this.petTypeSelected.toLowerCase()) {
      case 'cat':
        if(this.targetWeight < 3) {
          console.log(`It's a light cat!`)
          // 'light' cats
          console.log('Light')
          calories = ( this.targetWeight ** 1.061 ) * 53.7;
        } else if(this.targetWeight > 5.5) {
          console.log(`It's a heavy cat!`)
          // 'heavy' cats
          console.log('Heavy')
          calories = ( this.targetWeight ** 0.366 ) * 131.8;
        } else {
          console.log(`It's a normal cat!`)
          // 'normal' cats
          console.log('Normal')
          calories = ( this.targetWeight ** 1.115 ) * 46.8;
        }
        break;
      case 'dog':
        calories = ( this.targetWeight ** 0.93 ) * 62.5;
        break;
    }
    console.log('Calories calculated: ', calories)
    return Math.round(calories);
  }

}
