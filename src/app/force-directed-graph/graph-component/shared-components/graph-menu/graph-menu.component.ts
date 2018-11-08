import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatFormField, MatFormFieldControl, MatSidenav, MatSliderChange, MatSlideToggleChange} from "@angular/material";
import {RangeSliderComponentChange} from "../../../../tools/range-slider/range-slider.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-graph-menu',
  templateUrl: './graph-menu.component.html',
  styleUrls: ['./graph-menu.component.scss']
})
export class GraphMenuComponent implements OnInit {

  _settings: any = {
    fade: false
  };

  graphTypeCtrl: FormControl = new FormControl();

  @Output()
  readonly optionsChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly close: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  this.graphTypeCtrl.valueChanges.subscribe(val => {
    console.log(val)
    this._settings.data = val;
    this.optionsChange.emit(this._settings);
  })
  }



  sliderChange(change: MatSliderChange, field: string) {
    this._settings[field] = change.value;
    this.optionsChange.emit(this._settings);

  }

  setFilterType(change: MatSlideToggleChange) {
    this._settings.fade = change.checked;
  }

  closeMenu(): void {
    this.close.emit(true);
  }
}
