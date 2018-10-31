import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import { D3Service } from '../services/event-tracking/d3.service';
import {ForceDirectedGraph} from '../models/force-directed-graph';
import {Link} from '../models/link';

/**
 * directive to apply d3 clickable behavior to link
 */
@Directive({
    selector: '[pharosClickableLink]'
})
export class ClickableLinkDirective implements OnInit {
  /**
   * element that is clickable
   */
    @Input() pharosClickableLink: Link;

    /**
   * graph object
   */
  @Input() draggableInGraph: ForceDirectedGraph;

  /**
   * create services
   * @param {D3Service} d3Service
   * @param {ElementRef} _element
   */
  constructor(private d3Service: D3Service, private _element: ElementRef) { }

  /**
   * apply behavior to graph
   */
    ngOnInit() {
        this.d3Service.applyClickableLinkBehaviour(this._element.nativeElement, this.pharosClickableLink, this.draggableInGraph);
    }
}



