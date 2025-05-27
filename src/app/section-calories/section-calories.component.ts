import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-section-calories',
  templateUrl: './section-calories.component.html',
  styleUrls: ['./section-calories.component.css'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('600ms ease-out')),
      transition('inactive => active', animate('600ms ease-out'))
    ])
  ]
})

export class SectionCaloriesComponent implements OnInit {
  @Output() petSelected = new EventEmitter<string>();
  @Output() caloriesCalculated = new EventEmitter<number>();

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
    this.petSelected.emit(this.petTypeSelected);
  }

  onCurrentWeightUpdate(event: any) {
    this.currentWeight = Number.parseFloat((<HTMLSelectElement>event.target).value);
  }

  isCaloriesFormInvalid() {
    return !(
      !!this.petTypeSelected
      && !!this.currentBcs
      && !!this.targetBcs
      && !!this.currentWeight
    )
  }

  onCaloriesFormSubmit() {
    this.caloriesNumCalculated = this.getCalories();
    this.caloriesCalculated.emit(this.caloriesNumCalculated)
  }

  getCalories() {
    let calories = 0;
    let bcsMultiplier = 1 + (5 - this.currentBcs) * 0.1;
    const rawTargetWeight = bcsMultiplier * this.currentWeight;
    this.targetWeight = Math.round((rawTargetWeight + Number.EPSILON) * 100) / 100
    switch(this.petTypeSelected.toLowerCase()) {
      case 'cat':
        if(this.targetWeight < 3) {
          // 'light' cats
          calories = ( this.targetWeight ** 1.061 ) * 53.7;
        } else if(this.targetWeight > 5.5) {
          // 'heavy' cats
          calories = ( this.targetWeight ** 0.366 ) * 131.8;
        } else {
          // 'normal' cats
          calories = ( this.targetWeight ** 1.115 ) * 46.8;
        }
        break;
      case 'dog':
        calories = ( this.targetWeight ** 0.93 ) * 62.5;
        break;
    }
    return Math.round(calories);
  }
  flip: string = 'inactive';

  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }
}
