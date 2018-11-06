import { Component, OnInit } from '@angular/core';
import {MatSliderChange} from "@angular/material";

@Component({
  selector: 'app-graph-menu',
  templateUrl: './graph-menu.component.html',
  styleUrls: ['./graph-menu.component.scss']
})
export class GraphMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  sliderChange(change: MatSliderChange) {
    console.log(change);

  }

}
