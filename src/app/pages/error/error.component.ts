import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  constructor(
    private _location: Location
  ) { }

  back() {
    this._location.back()
  }
}
