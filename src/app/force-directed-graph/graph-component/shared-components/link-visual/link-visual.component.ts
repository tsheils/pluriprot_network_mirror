import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

import {Link} from '../../models/link';

/**
 * visual component for link object
 */
@Component({
  selector: '[link]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class LinkVisualComponent implements OnInit {
  /**
   * link passed in by graph
   */
  @Input() link: Link;

  /**
   * show the link label
   * @type {boolean}
   */
  showLinkLabel = true;

  /**
   * create services
   */
  constructor() {
  }

  /**
   * subscribe to settings change
   */
  ngOnInit() {
   //   console.log(this.link.source.x);

  }

  /**
   * helper function to return link properties
   * @param link
   * @param property
   * @returns {number}
   */
  getSource(link: Node, property: string): number {
    if (link[property]) {
      return link[property];
    } else {
      return 0;
    }
  }

  /**
   * function to subtract radius away from line end for arrow
   * @param link
   * @param attr_name
   * @returns {number}
   */
  endpointLessRadius(link, attr_name) {
    //  this.source = link.source;
    //   this.target = link.target;
    const x1 =  link.source.x || 0;
    const y1 =  link.source.y || 0;
    const x2 =  link.target.x || 0;
    const y2 =  link.target.y || 0;

    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const radius1 =  link.source.r || 0;
    const radius2 =  link.target.r || 0;

    if (attr_name === 'x1') { return x1 + (x2 - x1) * radius1 / distance; }
    if (attr_name === 'y1') { return y1 + (y2 - y1) * radius1 / distance; }
    if (attr_name === 'x2') { return x2 + (x1 - x2) * radius2 / distance; }
    if (attr_name === 'y2') { return y2 + (y1 - y2) * radius2 / distance; }
  }

}
