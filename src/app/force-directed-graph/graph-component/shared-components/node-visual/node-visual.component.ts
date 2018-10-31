import { Component, OnInit, Input } from '@angular/core';
import {Node} from '../../models/node';
import {NodeService} from '../../services/event-tracking/node.service';
import {NodeMenuControllerService} from '../../services/event-tracking/node-menu-controller.service';

/*export class StructureViewer {
  @Input() data: Compound | Pattern;
}*/

/**
 * visual component of node object
 */
@Component({
  selector: '[node]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit {
  /**
   * node passed in from graph
   */
  @Input() node: Node;
  /**
   * node label
   */
  label: string;
  /**
   * boolean to dispaly clicked properties
   * @type {boolean}
   */
  nodeClicked = false;
  /**
   * display name if different from node name
   */
  displayName: string;

  /**
   * create services
   * @param nodeService
   * @param nodeMenuController
   */
  constructor(
              private nodeService: NodeService,
              private nodeMenuController: NodeMenuControllerService
  ) {}

  /**
   * parse display name
   * adapt graph as settings dictate
   */
  ngOnInit(): void {
    if (this.node.name.length > 30) {
      this.displayName = this.node.name.slice(0, 30) + '...';
    } else {
      this.displayName = this.node.name;
    }
  }

  /**
   * open or close menu with node information
   */
  toggleMenu(): void {
    // this is the only place where the menu is opened
    this.nodeClicked = !this.nodeClicked;
    this.nodeService.clickedNodes(this.node);
    this.nodeMenuController.toggleVisible(this.node.uuid);
  }

}



