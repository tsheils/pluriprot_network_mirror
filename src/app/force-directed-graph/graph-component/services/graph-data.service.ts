import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {NodeService} from './event-tracking/node.service';
import {LinkService} from './event-tracking/link.service';
import {Link} from '../models/link';
import {Node} from '../models/node';

@Injectable()
export class GraphDataService {
  graph = {
    nodes: [],
    links: []
  };

  eventData: any;

  history = [];
  //  Observable navItem source
  private _graphHistorySource = new Subject<any>();
  historyMap: Map<string, any> = new Map();
  graphhistory$ = this._graphHistorySource.asObservable();
  originalEvent: string;
  noResults = false;
  filter = false;
  nodeList: any = [];
  linkList: any = [];
  nodes: any  = [];

  constructor(
    private nodeService: NodeService,
    private linkService: LinkService
  ) {
    this.makeGraph();
  }

  setGraph(graph: any) {
    this.nodeList = graph.nodes;
    this.linkList = graph.links;
    this.countLinks();
    this.graph = graph;
    this._graphHistorySource.next(graph);
  }

  getNodes(): Node[] {
    return Array.from(this.nodeService.getNodes().values());
  }

  getLinks(): Link[] {
    return Array.from(this.linkService.getLinks().values());
  }

  /**
   * updates graph with new nodes and links. filters out existing ones so as to not constantly create the same node
   * @returns void
   */
  makeGraph(): void {
    const newNodes = this.nodeList.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
    const newLinks = this.linkList.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });

    const diff = {
      removedNodes: this.graph.nodes.filter(node => newNodes.indexOf(node) === -1),
      addedNodes: newNodes.filter(node => this.graph.nodes.indexOf(node) === -1),
      removedLinks: this.graph.links.filter(link => newLinks.indexOf(link) === -1),
      addedLinks: newLinks.filter(link => this.graph.links.indexOf(link) === -1)
    };

    if (this.eventData) {
        this.historyMap.set(this.eventData.id, diff);
    }
    // apply diff to current graph
    this.applyDiff(diff);
    this.countLinks();
    // update graph
    this._graphHistorySource.next(this.graph);
    this.nodeList = [];
    this.linkList = [];
    this.filter = false;
  }

  /**
   * applies the updates to the graph, adds new nodes/links and removes dead ones
   * @param diff
   * @returns void
   */
  applyDiff(diff: any): void {
    // todo: it is possible to expand a node connected to an expanded node.
    // todo If the original node is closed, the second expanded nodes are still visible
    // todo: need to iterate over remaining nodes and links and remove them
    if (this.filter === true) {
      diff.removedNodes.forEach(node => {
        this.graph.nodes.splice(this.graph.nodes.indexOf(node), 1);
      });
      diff.removedLinks.forEach(link => {
        this.graph.links.splice(this.graph.links.indexOf(link), 1);
      });
    }
    diff.addedNodes.forEach(node => this.graph.nodes.push(node));
    diff.addedLinks.forEach(link => {
      this.graph.links.push(link);
    });
  }

  /**
   * returns a count of links for each node. Used to track node diameter size
   * @returns void
   */
  countLinks(): void {
    this.graph.nodes.forEach(node => node.linkCount = 1);
    for (const l of this.graph.links) {
      l.source.linkCount ++;
      l.target.linkCount ++;
    }
  }

  /**
   * empties nodes and links from graph, broadcasts empty object to all subscribers
   * @returns void
   */
  clearGraph(): void {
    this.graph.links = [];
    this.graph.nodes = [];
    this.nodeService.empty();
    this.linkService.empty();
    this._graphHistorySource.next(this.graph);
  }

  /**
   * Expands a node based on a selected property. fetches new data by creating a message with node parameters
   * @param {string} id
   * @param {string} type
   * @param properties
   * @returns void
   */
  nodeExpand(id: string, type: string, properties: any): void {
   /* const message: Message = this.messageService.getMessage(id, type, properties);
    // right now this is only creating a skeleton map object without the diff
    // this happens here because node id and label is needed for tracking.
    this.eventData = {id: id, diff: {}};
    this.dataConnectionService.messages.next(message);*/
  }

  /**
   * removes sub graph added to a node, uses a history map that tracks changes
   * @param {Node} node
   * @returns void
   */
  nodeCollapse(node: Node): void {
    this.filter = true;
// get the expand object to delete the nodes added
    const diff = this.historyMap.get(node.uuid);

    const undoDiff = {
      addedNodes: [],
      removedNodes: diff.addedNodes,
      addedLinks: [],
      removedLinks: diff.addedLinks
    };

    this.applyDiff(undoDiff);

    this.countLinks();
    this._graphHistorySource.next(this.graph);
    this.filter = false;

  }

  /**
   * returns an object containing a node array and a link array
   * download button uses this
   * @return {any}
   */
  returnGraph(): any {
    return this.graph;
  }
}
