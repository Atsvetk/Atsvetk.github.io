import { Component, Input, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

type DietInfo = {
  diet: string,
  type: 'dry' | 'wet' | '',
  calories: number,
  link: string
}

@Component({
  selector: 'app-section-food',
  templateUrl: './section-food.component.html',
  styleUrls: ['./section-food.component.css']
})

export class SectionFoodComponent implements OnInit {

  @Input()
  get caloriesNumCalculated(): number { return this._caloriesNumCalculated };
  set caloriesNumCalculated(caloriesNumCalculated: number) {
    this._caloriesNumCalculated = caloriesNumCalculated;
  }
  private _caloriesNumCalculated = 0;

  @Input()
  get pet(): string { return this._pet };
  set pet(pet: string) {
    this._pet = pet;
  }
  private _pet = '';

  @Input()
  get showPetSelectionField(): boolean { return this._showPetSelectionField };
  set showPetSelectionField(showPetSelectionField: boolean) {
    this._showPetSelectionField = showPetSelectionField;
  }
  private _showPetSelectionField = false;

  petOptions: string[] = [
    'Cat',
    'Dog'
  ];

  brand: string = '';
  brandOptions: string[] = [
    'Acana',
    'Trovet'
  ];
  caloriesInputted: number = this.caloriesNumCalculated;
  dietDry: string = '--None--';
  dietWet: string = '--None--';
  dietDryOptions: string[] = ['--None--'];
  dietWetOptions: string[] = ['--None--'];
  dietDryInfo: DietInfo = {
    diet: '',
    type: '',
    calories: 0,
    link: ''
  };
  dietWetInfo: DietInfo = {
    diet: '',
    type: '',
    calories: 0,
    link: ''
  }

  percentages = Array.from({length: 11}, (_, i) => i * 10)

  shouldDisplayDietDryLink: boolean = false;
  shouldDisplayDietWetLink: boolean = false;

  dryFoodAmount: number = 0;
  wetFoodAmount: number = 0;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onPetUpdate(event: any) {
    console.log(event);
    this.pet = (<HTMLSelectElement>event.target).value.toLowerCase();
    this.resetDietOptions();
    console.log(`PEt Type from section-food: ${this.pet}`);
  }

  onCaloriesInputUpdate(event: any) {
    console.log(event);
    this.caloriesInputted = Number.parseInt((<HTMLSelectElement>event.target).value);
    console.log(this.caloriesInputted);
  }

  onBrandUpdate(event: any) {
    console.log(event);
    this.brand = (<HTMLSelectElement>event.target).value;
    console.log(this.brand);
    if (this.brand !== '') {
      this.getDietDryOptions();
      this.shouldDisplayDietDryLink = false;
      this.getDietWetOptions();
      this.shouldDisplayDietWetLink = false;
    } else this.resetDietOptions();
  }

  getDietDryOptions() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    // if (this.brand !== '') {
      this.http.get(dietPath).subscribe( (response: any) => {
        console.log(response);
        this.dietDryOptions = response[this.pet.toLowerCase()]
          .filter((dietItem: DietInfo) => dietItem.type === 'dry')
          .map((dietItem: DietInfo) => dietItem.diet)
          .sort();
        this.dietDryOptions = ['--None--', ...this.dietDryOptions]
      })
    // } else {
    //   this.dietDryOptions = ['--None--'];
    //   this.shouldDisplayDietDryLink = false;
    // }
  }

  getDietWetOptions() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    // if (this.brand !== '') {
      this.http.get(dietPath).subscribe( (response: any) => {
        console.log(response);
        this.dietWetOptions = response[this.pet.toLowerCase()]
          .filter((dietItem: DietInfo) => dietItem.type === 'wet')
          .map((dietItem: DietInfo) => dietItem.diet)
          .sort();
        this.dietWetOptions = ['--None--', ... this.dietWetOptions]
      })
    // } else {
    //   this.dietWetOptions = ['--None--'];
    //   this.shouldDisplayDietWetLink = false;
    // }
  }

  resetDietOptions() {
    if (this.brand === '') {
      this.dietDryOptions = ['--None--'];
      this.dietWetOptions = ['--None--'];
    } else {
      this.getDietDryOptions();
      this.getDietWetOptions();
    }
    this.shouldDisplayDietDryLink = false;
    this.shouldDisplayDietWetLink = false;
  }

  getDietDryInfo() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    this.http.get(dietPath).subscribe( (response: any) => {
      console.log(response);
      this.dietDryInfo = response[this.pet.toLowerCase()]
        .find((diet: DietInfo) => diet.diet === this.dietDry)
    })
  }

  getDietWetInfo() {
    const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
    this.http.get(dietPath).subscribe( (response: any) => {
      console.log(response);
      this.dietWetInfo = response[this.pet.toLowerCase()]
        .find((diet: DietInfo) => diet.diet === this.dietWet)
    })
  }

  onDietDryUpdate(event: any) {
    console.log(event);
    this.dietDry = (<HTMLSelectElement>event.target).value;
    if(this.dietDry != '--None--') {
      this.getDietDryInfo();
      this.shouldDisplayDietDryLink = true;
    } else {
      this.shouldDisplayDietDryLink = false;
    }
    console.log(`DIET DRY: ${this.dietDry}`)
  }

  onDietWetUpdate(event: any) {
    console.log(event);
    this.dietWet = (<HTMLSelectElement>event.target).value;
    if(this.dietWet != '--None--') {
      this.getDietWetInfo();
      this.shouldDisplayDietWetLink = true;
    } else {
      this.shouldDisplayDietWetLink = false;
    }
    console.log(`DIET WET: ${this.dietWet}`)
  }

  isFoodFormInvalid() {
    return !(
      (!!this.caloriesInputted || !!this.caloriesNumCalculated)
      && !!this.brand
      && (!!this.dietDry || !!this.dietWet)
    )
  }

  shouldDisplaySlider() {
    return (this.dietDry !== '--None--') && (this.dietWet !== '--None--')
  }

  onFoodFormSubmit() {
    console.log(`CALORIES: ${this.caloriesInputted || this.caloriesNumCalculated}`);
    console.log(`DRY FOOD: ${JSON.stringify(this.dietDryInfo, null, 2) || 'NO INFO'}`)
    console.log(`WET FOOD: ${JSON.stringify(this.dietWetInfo, null, 2) || 'NO INFO'}`)
  }
}
