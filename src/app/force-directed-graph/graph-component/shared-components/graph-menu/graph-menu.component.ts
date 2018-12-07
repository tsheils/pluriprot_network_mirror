import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  MatCheckboxChange, MatFormField, MatFormFieldControl, MatSidenav, MatSliderChange,
  MatSlideToggleChange
} from "@angular/material";
import {RangeSliderComponentChange} from "../../../../tools/range-slider/range-slider.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-graph-menu',
  templateUrl: './graph-menu.component.html',
  styleUrls: ['./graph-menu.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class GraphMenuComponent implements OnInit {

  _settings: any = {
    fade: false
  };

  subGraphTypeCtrl: FormControl = new FormControl();
  activeGraph: string = 'nscs';

  @Output()
  readonly optionsChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly close: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
    this.subGraphTypeCtrl.valueChanges.subscribe(val => {
      this._settings = {
        fade: false
      };

      this._settings.subgraph = val;
      this.optionsChange.emit(this._settings);
  })
  }

  setActiveGraph(val: string) {
    this.activeGraph = val;
    this._settings.data = val;
    this._settings.subgraph = null;
    this.optionsChange.emit(this._settings);
  }

  sliderChange(change: MatSliderChange, field: string) {
    this._settings[field] = change.value;
    this.optionsChange.emit(this._settings);

  }

  setFilterType(change: MatSlideToggleChange) {
    this._settings.fade = change.checked;
  }

  noData(change: MatCheckboxChange) {
    console.log(change);
    this._settings['no_data'] = change.checked;
    this.optionsChange.emit(this._settings);
  }

  closeMenu(): void {
    this.close.emit(true);
  }
}
