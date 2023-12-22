import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {link} from 'fs';

type DietInfo = {
  diet: string,
  type: 'dry' | 'wet' | '',
  calories: number,
  link: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  ngOnInit() {

  }

  title = 'Pet Food Calculations';
  creditsShown = false;

  petOptions: string[] = [
    'Cat',
    'Dog'
  ];
  pet: string = '';
  bcsOptions: number[] = Array.from({length: 9}, (_, i) => i + 1);
  currentBcs: number = 0;
  targetBcs: number = 0;
  currentWeight: number = 0;
  targetWeight: number = 0;
  caloriesCalculated: number = 0;

  caloriesInputted: number = 0;
  brand: string = '';
  brandOptions: string[] = [
    'Acana',
    'Trovet'
  ];
  diet: string = '';
  dietOptions: string[] = [''];
  dietInfo: DietInfo = {
    diet: '',
    type: '',
    calories: 0,
    link: ''
  }

  dryFoodAmount: number = 0;
  wetFoodAmount: number = 0;
  // desiredWetFoodAmount: number = 0;
  isInputFormSubmitted: boolean = false;
  rangeValue: number = 0;
  rangeOptions: number[] = [];

  // HEADER

  onCreditsClick() {
    this.creditsShown = !this.creditsShown;
  }

  // onInputUpdate(event: any) {
  //   console.log(event)
  //   this.dryFoodAmount = Number.parseInt((<HTMLInputElement>event.target).value)
  // }
  //
  // selectOptions = [
  //   0.5,
  //   1,
  //   1.5,
  //   2,
  //   2.5,
  //   3,
  //   3.5,
  //   4
  // ]
  //
  // onSelectUpdate(event:any) {
  //   console.log(event);
  //   this.wetFoodAmount = Number.parseFloat((<HTMLSelectElement>event.target).value);
  //   console.log(this.wetFoodAmount);
  // }

  // CALORIES SECTION

  onPetUpdate(event: any) {
    console.log(event);
    this.pet = (<HTMLSelectElement>event.target).value.toLowerCase();
    console.log(`${this.pet}`);
  }

  onCurrentBcsSelectUpdate(event: any) {
    console.log(event)
    this.currentBcs = Number.parseFloat((<HTMLSelectElement>event.target).value)
    console.log(this.currentBcs)
  }

  // onTargetBcsInputUpdate(event: any) {
  //   console.log(event)
  //   this.targetBcs = Number.parseInt((<HTMLSelectElement>event.target).value)
  //   console.log(this.targetBcs)
  // }

  onTargetBcsSelectUpdate(event: any) {
    console.log(event)
    this.targetBcs = Number.parseFloat((<HTMLSelectElement>event.target).value)
    console.log(this.targetBcs)
  }

  onCurrentWeightUpdate(event: any) {
    console.log(event)
    this.currentWeight = Number.parseFloat((<HTMLSelectElement>event.target).value)
    console.log(this.currentWeight)
  }

  isCaloriesFormInvalid() {
    return !(
      !!this.pet
      && !!this.currentBcs
      && !!this.targetBcs
      && !!this.currentWeight
    )
  }

  onCaloriesFormSubmit() {
    console.log('Calories submitted!')
    this.caloriesCalculated = this.getCalories();
    this.caloriesInputted = this.caloriesCalculated;
    console.log(this.caloriesCalculated)
  }

  getCalories() {
    let calories = 0;
    let bcsMultiplier = 1 + (this.targetBcs - this.currentBcs) * 0.1;
    console.log(`BCS MULTIPLIER: ${bcsMultiplier}`);
    const rawTargetWeight = bcsMultiplier * this.currentWeight;
    this.targetWeight = Math.round((rawTargetWeight + Number.EPSILON) * 100) / 100
    console.log('targetWeight', this.targetWeight)
    switch(this.pet) {
      case 'cat':
        if(this.targetWeight < 3) {
          // 'light' cats
          console.log('Light')
          calories = ( this.targetWeight ** 1.061 ) * 53.7;
        } else if(this.targetWeight > 5.5) {
          // 'heavy' cats
          console.log('Heavy')
          calories = ( this.targetWeight ** 0.366 ) * 131.8;
        } else {
          // 'normal' cats
          console.log('Normal')
          calories = ( this.targetWeight ** 1.115 ) * 46.8;
        }
        break;
      case 'dog':
        calories = ( this.targetWeight ** 0.93 ) * 62.5;
        break;
    }

    return Math.round(calories);
  }
  // FOOD AMOUNT SECTION

  onCaloriesInputUpdate(event: any) {
    console.log(event);
    this.caloriesInputted = Number.parseInt((<HTMLSelectElement>event.target).value);
    console.log(this.caloriesInputted);
  }

  onBrandUpdate(event: any) {
    console.log(event);
    this.brand = (<HTMLSelectElement>event.target).value;
    console.log(this.brand);
    this.getDietOptions();
  }

  getDietOptions() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    this.http.get(dietPath).subscribe( (response: any) => {
      console.log(response);
      this.dietOptions = response[this.pet.toLowerCase()].map((dietItem: any) => dietItem.diet)
    })
  }

  getDietInfo() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    this.http.get(dietPath).subscribe( (response: any) => {
      console.log(response);
      this.dietInfo = response[this.pet.toLowerCase()]
        .find((diet: DietInfo) => diet.diet === this.diet)
    })
  }

  onDietUpdate(event: any) {
    console.log(event);
    this.diet = (<HTMLSelectElement>event.target).value;
    this.getDietInfo();
    console.log(this.diet)
  }

  isFoodFormInvalid() {
    return !(
      !!this.caloriesInputted
      && !!this.brand
      && !!this.diet
    )
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
