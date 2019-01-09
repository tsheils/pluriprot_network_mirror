import {Injectable} from '@angular/core';
import {Node} from '../../models/node';
import {Link} from '../../models/link';
import {ForceDirectedGraph} from '../../models/force-directed-graph';
import * as d3 from 'd3';
import {NodeService} from './node.service';
import {LinkService} from './link.service';

@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
   * while maintaining the d3 simulations physics
   */

  constructor(
    private nodeService: NodeService,
    private linkService: LinkService,
  ) {
  }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select('#root');
    const transform = d3.zoomIdentity.translate(svg.node().clientHeight / 2, svg.node().clientWidth / 2).scale(.15);


    zoomed = () => {
      const transform = d3.event.transform;
      container.attr("transform", d3.event.transform); // updated for d3 v4
    };
    zoom = d3.zoom().on("zoom", zoomed);

     svg
       .call(zoom.transform, transform) // Calls/inits handleZoom
       .call(zoom);
  }

  /** A method to register clicks on the graph that aren't node or link clicks (resets those behaviors) */
  applyClickOffBehaviour(svgElement) {
    const d3element = d3.select(svgElement);
    d3element.on('click',  () => { this._clearNodes()});

  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);

    const started = (): void => {
      d3.event.sourceEvent.stopPropagation();
      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }
    };

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      const ended = (): void => {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }
        graph.simulation.stop();

        // by not resetting these, the node stays where it is dragged
        /*  node.fx = null;
         node.fy = null;*/
      };

    d3element.call(d3.drag()
      .on('start', started)
      .on('drag', dragged)
      .on('end', ended)
    );
  }

  /** A method to bind hoverable behaviour to an svg element */
  applyHoverableNodeBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);
    let connectedLinks;
    let connectedNodes;
    let maximalLinks: any[] = [];
    let neighbors: Link[] = [];
  //  let downstreamNeighbors: Link[] = [];

    // todo: this is kind of piggybacking on the filter function
    const getNeighborLinks = (e: Link): boolean => {
      const neighbor = (node.uuid === (typeof (e.source) === 'object' ? e.source.uuid : e.source)
        || node.uuid === (typeof (e.target) === 'object' ? e.target.uuid : e.target));
      if (neighbor === true) {
        neighbors.push(e);
      }
      return node.uuid === (typeof (e.source) === 'object' ? e.source.uuid : e.source);
    };

    const getNeighborNodes = (e: any): boolean => {
      return connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) > -1;
    };

    const findMaximalLinks = (e: any): boolean => {
      if (e.properties && e.properties.islargest) {
        maximalLinks = maximalLinks.concat([e.source.uuid, e.target.uuid]).reduce((x, y) => x.includes(y) ? x : [...x, y], []);
        return true;
      } else {
        return false;
      }
    };

    const findMaximalNodes = (e: any): boolean => {
      return maximalLinks.indexOf(e.uuid) > -1;
    };

    const decorateNodes = (): void => {
      d3element.select('circle').classed('hovering', true);
      connectedLinks = d3.selectAll('.link')
        .data(graph.links)
        .filter(getNeighborLinks)
        .classed('hovering', true)
/*        .classed('connected', function(link) {return link.edgeType !== 'down'; })
        .classed('connectedflat', function(link) {return link.edgeType === 'down'; })*/;

      connectedNodes = d3.selectAll('circle')
        .data(graph.nodes)
        .filter(getNeighborNodes)
        .classed('connected', true);

      connectedLinks.filter(findMaximalLinks)
        .classed('maximal', true);

      connectedNodes.filter(findMaximalNodes)
        .classed('maximal', true);
    };

    const clearNodes = (): void => {
      d3.selectAll('.link')
        .classed('connected', false)
        .classed('connectedflat', false)
        .classed('hovering', false)
        .classed('maximal', false);
      d3.selectAll('circle')
        .classed('connected', false)
        .classed('hovering', false)
        .classed('maximal', false);
    };

    // todo: this is called on drag and iterates over the entire graph
    const mouseOverFunction = (): void => {
      if (d3.event.defaultPrevented) { return; }
      decorateNodes();
      this.nodeService.hoveredNode([node]);
      if (neighbors.length > 0) {
        this.linkService.hoveredLink(neighbors);
      }
    };

    const mouseOutFunction = (): void => {
      clearNodes();
      neighbors = [];
    };

// todo: this fires constantly as the node is dragged
    d3element.on('mouseover', mouseOverFunction).on('mouseout', mouseOutFunction);

  }

  /** A method to bind hoverable behaviour to an svg element */
  applyHoverableLinkBehaviour(element, link: Link) {
    const d3element = d3.select(element);
    const arrowType = 'connected';

    const mouseOverFunction = (): void => {
      d3element.select('.link').classed('hovering', true).classed(arrowType, true);
      this.linkService.hoveredLink([link]);
    };

    const mouseOutFunction = (): void => {
      d3element.select('.link').classed('hovering', false).classed(arrowType, false);
    };

    d3element.on('mouseover', mouseOverFunction).on('mouseout', mouseOutFunction);

  }


  /** A method to bind click events to an svg element */
  // emits the node for other components to listen for
  applyClickableNodeBehaviour = (element, node: Node, graph: ForceDirectedGraph) =>  {

    const d3element = d3.select(element);
    let connectedLinks;
    let nonConnectedLinks;
    let connectedNodes;
    let nonConnectedNodes;

    const getNeighborLinks = (e: Link): boolean => {
      return (node.uuid === (typeof (e.source) === 'object' ? e.source.uuid : e.source)
        || node.uuid === (typeof (e.target) === 'object' ? e.target.uuid : e.target));
    };

    const getNonNeighborLinks = (e: Link): boolean => {
      return (node.uuid !== (typeof (e.source) === 'object' ? e.source.uuid : e.source)
        && node.uuid !== (typeof (e.target) === 'object' ? e.target.uuid : e.target));
    };

    const getNeighborNodes = (e: any): boolean => {
      return (connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) > -1) ||
        (connectedLinks.data().map(link => link.source.uuid).indexOf(e.uuid) > -1);
    };

    const getNotNeighborNodes = (e: any): boolean => {
      if((connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) === -1) &&
        (connectedLinks.data().map(link => link.source.uuid).indexOf(e.uuid) === -1)) {
        e.showLabel = false;
      }
      return (connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) === -1) &&
        (connectedLinks.data().map(link => link.source.uuid).indexOf(e.uuid) === -1);
    };


    const decorateNodes = (): void => {

      //highlight links
      connectedLinks = d3.selectAll('.link')
        .data(graph.links)
        .filter(getNeighborLinks)
        .classed('clicked', true);

      nonConnectedLinks = d3.selectAll('.link')
        .data(graph.links)
        .filter(getNonNeighborLinks)
        .classed('not-related', true);

              // highlight neighbor nodes
      connectedNodes = d3.selectAll('.node-child')
        .data(graph.nodes)
        .filter(getNeighborNodes)
        .classed('clicked-neighbor', true);

      nonConnectedNodes = d3.selectAll('.node-child')
        .data(graph.nodes)
        .filter(getNotNeighborNodes)
        .classed('not-related', true);

      // highlight parent
      const parent = d3.selectAll('.node-child')
        .data(graph.nodes)
        .filter(d => d.uuid === node.uuid)
        .classed('clicked-neighbor', true)
        .classed('not-related', false);
      };


     const clickFunction = (): void => {
       d3.event.stopPropagation();
       this._clearNodes();
      decorateNodes();
      // d3.select('#root').attr('transform', 'translate(' + -node.x + ',' + -node.y + ')');
    };

    d3element.on('click', clickFunction);
    }

  /** A method to bind click events to an svg element */
    // emits the link for other components to listen for
  applyClickableLinkBehaviour = (element, link: Link, graph: ForceDirectedGraph) =>  {
    const d3element = d3.select(element);
    const arrowType = 'connected';

    const clickFunction = (): void => {
      d3.event.stopPropagation();
      const d3link = d3element.select('.link');
      d3link.classed('clicked', !d3link.classed('clicked')).classed(arrowType, !d3link.classed(arrowType));
      if (d3link.classed('clicked')) {
        this.linkService.clickedLinks(link);
      } else {
        this.linkService.removeClickedLink(link);
      }
    };

    d3element.on('click', clickFunction);
  }

  /** The interactable graph we will return
   * This method does not interact with the document, purely physical calculations with d3
   */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: {width, height}) {
    return new ForceDirectedGraph(nodes, links, options);
  }

/*  zoomFit2 (node, nodeElement) {
    console.log(node);
    console.log(nodeElement);
    console.log(nodeElement.node().parentElement);
    let root = d3.select('#root');
    let focus = root;
    let container = d3.select('#fdg');
    let view = root;
    console.log(container);
    console.log(root);
    let containerbb = container.node().getBBox();

    //this basically sets the initial view variable
    zoomTo([root.node().getBBox().x, root.node().getBBox().y, .15]);

    function zoomTo(v) {
      console.log("view to")
      console.log(v);
      console.log("parent view");
      console.log(view);
      console.log(nodeElement.node().parentElement);
      console.log(containerbb);
      const k = containerbb.width / v[2];
      view = v;
      console.log(k);
      console.log(nodeElement.node().parentElement.getBBox());
      nodeElement.node().parentElement.attr("transform", d => {
       console.log(d);
       return `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`;
    });
      node.attr("r", d => d.r * k);
    }

    function zoom(d) {
      console.log(" zoom");
      const focus0 = focus;

      focus = d;
      console.log("D");
      console.log(d);
      console.log(view);
      console.log([focus.x, focus.y, focus.r * 2]);
      const transition = container.transition()
        .duration(750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });
      console.log(transition);
    }
    console.log(node);
    zoom(node);
  }



  zoomFit(node?) {
    let svg = d3.select('#fdg');
    let container = d3.select('#root').node();
if(node){
  console.log("selecting node");
  container = node.node().parentElement;
}

    const zoom = d3
      .zoom()
      .on('zoom', function () {
        console.log(d3.event);
        d3.select('#root').attr("transform", d3.event.transform); // updated for d3 v4

      });

    const bounds = container.getBBox();
    const parent = svg.node();
    const fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
      fullHeight = parent.clientHeight;
    console.log(parent);
    let width = bounds.width,
      height = bounds.height;
    console.log(bounds.y)
    console.log(bounds.x)
    const midX: number = bounds.x + (width / 2),
      midY: number = bounds.y + (height / 2);
    if (width == 0 || height == 0) return; // nothing to fit
    console.log(0.9 / Math.max(width / fullWidth, height/fullHeight));
    const scale = Math.max(1 , Math.min(8, 0.9 / Math.max(width / fullWidth, height/fullHeight)));
    const translate = [(parent.getBBox().width / 2 + midX) / 2, parent.getBBox().height / 2 - midY];
    console.log(scale)
    console.log(translate)

    const contbbox = svg.node().getBBox();
    const  bbox = container.getBBox();
    console.log(contbbox);
    console.log(bbox);
    const vx = contbbox.x;		// container x co-ordinate
    const vy = contbbox.y;		// container y co-ordinate
    const vw = contbbox.width;	// container width
    const vh = contbbox.height;	// container height
    var bx = bbox.x;
    var by = bbox.y;
    var bw = bbox.width;
    var bh = bbox.height;
    var tx = -bx * scale + vx + vw / 2 - bw * scale / 2;
    var ty = -by * scale + vy + vh / 2 - bh * scale / 2;

console.log([tx, ty]);

    svg
    .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale / 10) ); // updated for d3 v4

  }*/

  _clearNodes(): void {
    d3.selectAll('.link')
      .classed('clicked', false)
      .classed('not-related', false);
    d3.selectAll('.node-child')
      .classed('connected', false)
      .classed('clicked-parent', false)
      .classed('clicked-neighbor', false)
      .classed('not-related', false)
      .classed('clicked', false);
  };

  _manualClick(node: Node, graph: ForceDirectedGraph){
    this._clearNodes();
    let connectedLinks;
    let nonConnectedLinks;
    let connectedNodes;
    let nonConnectedNodes;

    const getNeighborLinks = (e: Link): boolean => {
      return (node.uuid === (typeof (e.source) === 'object' ? e.source.uuid : e.source)
        || node.uuid === (typeof (e.target) === 'object' ? e.target.uuid : e.target));
    };

    const getNonNeighborLinks = (e: Link): boolean => {
      return (node.uuid !== (typeof (e.source) === 'object' ? e.source.uuid : e.source)
        && node.uuid !== (typeof (e.target) === 'object' ? e.target.uuid : e.target));
    };

    const getNeighborNodes = (e: any): boolean => {
      return (connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) > -1) ||
        (connectedLinks.data().map(link => link.source.uuid).indexOf(e.uuid) > -1);
    };

    const getNotNeighborNodes = (e: any): boolean => {
      return (connectedLinks.data().map(link => link.target.uuid).indexOf(e.uuid) === -1) &&
        (connectedLinks.data().map(link => link.source.uuid).indexOf(e.uuid) === -1);
    };

      //highlight links
      connectedLinks = d3.selectAll('.link')
        .data(graph.links)
        .filter(getNeighborLinks)
        .classed('clicked', true);

      nonConnectedLinks = d3.selectAll('.link')
        .data(graph.links)
        .filter(getNonNeighborLinks)
        .classed('not-related', true);

    nonConnectedNodes = d3.selectAll('.node-child')
      .data(graph.nodes)
      .filter(getNotNeighborNodes)
      .classed('not-related', true);

      // highlight neighbor nodes
      connectedNodes = d3.selectAll('.node-child')
        .data(graph.nodes)
        .filter(getNeighborNodes)
        .classed('clicked-neighbor', true);

    // highlight parent
    const parent = d3.selectAll('.node-child')
      .data(graph.nodes)
      .filter(d => d.uuid === node.uuid)
      .classed('clicked-neighbor', true)
      .classed('not-related', false);

   // this.zoomFit(parent);
   // console.log(parent);
   // console.log(node);
   // this.zoomFit2(node, parent);
    };


  resetZoom() {
    const svg = d3.select('#fdg');
    const container = d3.select('#root');
    const transform = d3.zoomIdentity.translate(svg.node().clientHeight / 2, svg.node().clientWidth / 2).scale(.15);



    const zoomed = () => {
      container.attr("transform", d3.event.transform); // updated for d3 v4
    };

   const zoom = d3.zoom().on("zoom", zoomed);

    svg
      .call(zoom.transform, transform) // Calls/inits handleZoom
      .call(zoom);
  }
}
