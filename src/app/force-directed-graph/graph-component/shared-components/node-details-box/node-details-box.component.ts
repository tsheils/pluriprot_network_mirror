import { Component, OnInit } from '@angular/core';
import {Protein} from "../../models/node";
import {NodeService} from "../../services/event-tracking/node.service";

@Component({
  selector: 'app-node-details-box',
  templateUrl: './node-details-box.component.html',
  styleUrls: ['./node-details-box.component.scss']
})
export class NodeDetailsBoxComponent implements OnInit {

  node: Protein;

  constructor(
    private nodeService: NodeService
  ) { }

  ngOnInit() {
    this.nodeService.nodeList$.subscribe(res => this.node = res.hovered[0])
  }

}
