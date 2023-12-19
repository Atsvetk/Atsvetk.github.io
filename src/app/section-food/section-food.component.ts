import {Component, Input, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

type DietInfo = {
  diet: string,
  type: 'dry' | 'wet' | '',
  calories: number,
  link: string
}

@Component({
  selector: 'app-section-food',
  templateUrl: './section-food.component.html',
  styleUrls: ['./section-food.component.css'],
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
  get shouldBeDisabled(): boolean { return this._shouldBeDisabled };
  set shouldBeDisabled(shouldBeDisabled: boolean) {
    this._shouldBeDisabled = shouldBeDisabled;
  }
  private _shouldBeDisabled = false

  petOptions: string[] = [
    'Cat',
    'Dog'
  ];

  brand: string = '';
  brandOptions: string[] = [
    'Acana',
    'Trovet'
  ];
  allBrandDiets: {} = {};
  caloriesInputted: number = this.caloriesNumCalculated;
  noDietOption = '--None--';
  dietDry: string = this.noDietOption;
  dietWet: string = this.noDietOption;
  dietDryOptions: string[] = [this.noDietOption];
  dietWetOptions: string[] = [this.noDietOption];
  brandDietsInfo: DietInfo[] = [];
  dietDryInfo: DietInfo | undefined = {
    diet: '',
    type: '',
    calories: 0,
    link: ''
  };
  dietWetInfo: DietInfo | undefined = {
    diet: '',
    type: '',
    calories: 0,
    link: ''
  }

  shouldDisplayDietDryLink: boolean = false;
  shouldDisplayDietWetLink: boolean = false;

  dryFoodAmount: number = 0;
  wetFoodAmount: number = 0;
  wetFoodShownAmount: number = 0;
  dryFoodMaxAmount: number = 0;
  wetFoodMaxAmount: number = 0;
  isFoodCalculated: boolean = false;

  dryDietFormControl = new FormControl('');
  filteredDryDietOptions: Observable<string[]> | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onDietDryInputClick() {
    this.filteredDryDietOptions = this.dryDietFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.dietDryOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  onPetUpdate(event: any) {
    this.resetDietOptions();
    this.isFoodCalculated = false;
  }

  onCaloriesInputUpdate(event: any) {
    this.caloriesInputted = Number.parseInt((<HTMLSelectElement>event.target).value);
    this.caloriesInputted = this.caloriesInputted < 0 ? 0 : this.caloriesInputted;
    this.isFoodCalculated = false;
    this.resetFoodCalculations()
  }

  onBrandUpdate(event: any) {
    this.isFoodCalculated = false;
    if (this.brand !== '') {
      const dietPath: string = `/assets/diets/${this.brand.toLowerCase()}.json`;
      this.http.get(dietPath).subscribe((response: any) => {
        this.brandDietsInfo = response[this.pet.toLowerCase()];
        this.resetDietOptions();
        this.resetFoodCalculations();
      })
    }
  }

  getDietDryOptions() {
    this.dietDryOptions = this.brandDietsInfo
      .filter((dietItem: DietInfo) => dietItem.type === 'dry')
      .map((dietItem: DietInfo) => dietItem.diet)
      .sort();
    this.dietDryOptions = [this.noDietOption, ...this.dietDryOptions]
  }

  getDietWetOptions() {
    this.dietWetOptions = this.brandDietsInfo
      .filter((dietItem: DietInfo) => dietItem.type === 'wet')
      .map((dietItem: DietInfo) => dietItem.diet)
      .sort();
    this.dietWetOptions = [this.noDietOption, ... this.dietWetOptions]
  }

  resetDietOptions() {
    if (this.brand === '') {
      this.dietDryOptions = [this.noDietOption];
      this.dietWetOptions = [this.noDietOption];
    } else {
      this.getDietDryOptions();
      this.getDietWetOptions();
    }
    this.dietDry = this.noDietOption;
    this.dietWet = this.noDietOption;
    this.shouldDisplayDietDryLink = false;
    this.shouldDisplayDietWetLink = false;
  }

  resetFoodCalculations() {
    this.dryFoodAmount = 0;
    this.wetFoodAmount = 0;
    this.wetFoodShownAmount = 0;
    this.dryFoodMaxAmount = this.dietDry === this.noDietOption ? 0 : this.getDryFoodMaxAmount();
    this.wetFoodMaxAmount = this.dietWet === this.noDietOption ? 0 : this.getWetFoodMaxAmount();
  }

  getDietDryInfo() {
    this.dietDryInfo = this.brandDietsInfo
      .filter((dietItem: DietInfo) => dietItem.type === 'dry')
      .find((diet: DietInfo) => diet.diet === this.dietDry)
  }

  getDietWetInfo() {
    this.dietWetInfo = this.brandDietsInfo
      .filter((dietItem: DietInfo) => dietItem.type === 'wet')
      .find((diet: DietInfo) => diet.diet === this.dietWet)
  }

  onDietDryUpdate(event: any) {
    console.log(`On Dry Diet Update EVENT: ${event}`)
    this.dietDry = event;
    this.isFoodCalculated = false;
    if(this.dietDry != this.noDietOption) {
      this.getDietDryInfo();
      if(this.dietDryInfo){
        this.shouldDisplayDietDryLink = true;
        this.dryFoodMaxAmount = this.getDryFoodMaxAmount();
      }
    } else {
      this.shouldDisplayDietDryLink = false;
    }
  }

  onDietWetUpdate(event: any) {
    this.dietWet = event;
    this.isFoodCalculated = false;
    if(this.dietWet != this.noDietOption) {
      this.getDietWetInfo();
      if(this.dietWetInfo) {
        this.shouldDisplayDietWetLink = true;
        this.wetFoodMaxAmount = this.getWetFoodMaxAmount();

      }
    } else {
      this.shouldDisplayDietWetLink = false;
    }
  }

  isFoodFormInvalid() {
    return !(
      (!!this.caloriesInputted || !!this.caloriesNumCalculated)
      && !!this.brand
      && ((this.dietDry !== this.noDietOption || this.dietWet !== this.noDietOption))
    )
  }

  shouldDisplayWetDesiredAmount() {
    return (this.dietDry !== this.noDietOption) && (this.dietWet !== this.noDietOption)
  }

  getDryFoodMaxAmount() {
    if(this.dietDryInfo) {
      return Math.round( (this.caloriesInputted || this.caloriesNumCalculated) * 1000 / this.dietDryInfo.calories);
    } else return 0
  }

  getWetFoodMaxAmount() {
    if(this.dietWetInfo) {
      return Math.round( (this.caloriesInputted || this.caloriesNumCalculated) * 1000 / this.dietWetInfo.calories);
    } else return 0
  }

  onDesiredWetFoodAmountChange(event: any) {
    this.wetFoodAmount = Number.parseInt((<HTMLSelectElement>event.target).value);
    this.wetFoodAmount = this.wetFoodAmount < 0 ? 0 :
      this.wetFoodAmount > this.wetFoodMaxAmount ? this.wetFoodMaxAmount : this.wetFoodAmount;
    this.isFoodCalculated = false;
  }

  getDesiredDryFoodAmount() {
    const wetFoodPart = this.wetFoodAmount / this.wetFoodMaxAmount || 0;
    this.dryFoodAmount = Math.round(this.dryFoodMaxAmount - this.dryFoodMaxAmount * wetFoodPart)
  }

  isFoodFormValid() {
    return (
      !!this.pet &&
      !!(this.caloriesInputted || this.caloriesNumCalculated) &&
      ( (this.dietDry !== this.noDietOption || this.dietWet !== this.noDietOption) ||
      (this.dietDry !== this.noDietOption && this.dietWet !== this.noDietOption && !isNaN(this.wetFoodAmount)) )
    )
  }

  onFoodFormSubmit() {
    this.getDesiredDryFoodAmount();
    this.isFoodCalculated = true;
    this.wetFoodShownAmount = this.dryFoodAmount ? this.wetFoodAmount : this.wetFoodMaxAmount;
  }
}
