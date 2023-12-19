import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-diet-autocomplete',
  templateUrl: './diet-autocomplete.component.html',
  styleUrls: ['./diet-autocomplete.component.css']
})
export class DietAutocompleteComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;
  diet: string = '';

  @Input()
  title: string = ''

  options: string[] = [];

  @Input('options') set onOptions(options: string[]){
    this.options = options;
    this.initAutoComplete()
  }

  @Input()
  shouldBeDisabled: boolean = true;

  @Input()
  get brandSelected(): string { return this._brandSelected };
  set brandSelected(brandSelected: string) {
    this._brandSelected = brandSelected;
    this.myControl.reset('');
    this.ngOnInit()
  }
  private _brandSelected = '';

  @Input()
  shouldDisplayLink: boolean = false;

  @Input()
  dietLink: string | undefined = '';

  @Output() dietSelected = new EventEmitter<string>();

  ngOnInit() {
    if(this.shouldBeDisabled || !this.brandSelected) {
      this.myControl.disable()
    }
    else {
      this.myControl.enable();
      this.initAutoComplete();
    }
  }

  initAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }


  private _filter(value: string): string[] {
    value = value ? value : '';
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectionChange(event:any) {
    this.diet = event.option.value;
    this.dietSelected.emit(this.diet);
  }
}
