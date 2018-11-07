import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatSliderChange, MatSlideToggleChange} from "@angular/material";

@Component({
  selector: 'app-graph-menu',
  templateUrl: './graph-menu.component.html',
  styleUrls: ['./graph-menu.component.scss']
})
export class GraphMenuComponent implements OnInit {

  _settings: any = {
    fade: false
  };

  @Output()
  readonly optionsChange: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  sliderChange(change: MatSliderChange, field: string) {
    console.log(change);
    this._settings[field] = change.value;
    this.optionsChange.emit(this._settings);

  }

  setFilterType(change: MatSlideToggleChange) {
    console.log(change);
    this._settings.fade = change.checked;
  }

}
