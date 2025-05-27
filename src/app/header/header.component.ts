import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  title = 'Pet Foood Calculations';
  creditsShown = false;

  onCreditsClick() {
    this.creditsShown = !this.creditsShown;
  }

}
