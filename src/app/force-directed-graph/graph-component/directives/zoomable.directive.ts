import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import { D3Service } from '../services/event-tracking/d3.service';
import {ForceDirectedGraph} from '../models/force-directed-graph';

/**
 * directive to apply d3 zoomable behavior to graph
 */
@Directive({
    selector: '[pharosZoomable]'
})
export class ZoomableDirective implements OnInit {
  /**
   * element that is zoomable
    */
  @Input() zoomableOf: ElementRef;
  /**
   * graph object
   */
  @Input() draggableInGraph: ForceDirectedGraph;

  /**
   * create services
   * @param {D3Service} d3Service
   * @param {ElementRef} _element
   */
  constructor(private d3Service: D3Service, private _element: ElementRef) {}

  /**
   * apply behavior to graph
   */
    ngOnInit() {
        this.d3Service.applyZoomableBehaviour(this.zoomableOf, this._element.nativeElement);
    }
}
