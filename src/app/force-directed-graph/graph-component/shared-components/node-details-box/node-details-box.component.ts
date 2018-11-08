import { Component, OnInit } from '@angular/core';
import {Protein} from "../../models/node";
import {NodeService} from "../../services/event-tracking/node.service";
import {LinkService} from "../../services/event-tracking/link.service";
import {Link} from "../../models/link";

@Component({
  selector: 'app-node-details-box',
  templateUrl: './node-details-box.component.html',
  styleUrls: ['./node-details-box.component.scss']
})
export class NodeDetailsBoxComponent implements OnInit {

  node: Protein;
  link: Link;

  constructor(
    private nodeService: NodeService,
    private linkService: LinkService
  ) { }

  ngOnInit() {
    this.nodeService.nodeList$.subscribe(res => this.node = res.hovered[0]);
    this.linkService.linkslist$.subscribe(res => this.link = res.hovered[0]);
  }

  getLabel(value: number): string {
    if(!value || value === -100){
      return 'no data'
    } else {
      return value.toExponential(2);
    }
  }

}
