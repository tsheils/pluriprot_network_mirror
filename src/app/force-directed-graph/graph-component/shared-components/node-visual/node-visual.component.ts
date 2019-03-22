<<<<<<< HEAD
import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Node, Protein} from '../../models/node';
=======
import {Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Node} from '../../models/node';
>>>>>>> 203407fc605741f942d01fa2afc5855fe978a973
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
  styleUrls: ['./node-visual.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class NodeVisualComponent implements OnInit {

  /**
   * node passed in from graph
   */
  @Input() node: Protein;
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
   * @param el -- reference to the node element - used to get class list to hide text
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
   // this.nodeClicked = !this.nodeClicked;
    this.nodeService.clickedNodes(this.node);
    this.nodeMenuController.toggleVisible(this.node.uuid);
  }

}



