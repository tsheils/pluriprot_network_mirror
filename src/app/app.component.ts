import {Component, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs/index";
import {zipAll} from "rxjs/internal/operators";
import {Link} from "./force-directed-graph/graph-component/models/link";
import {Node, Protein} from "./force-directed-graph/graph-component/models/node";
import {NodeService} from "./force-directed-graph/graph-component/services/event-tracking/node.service";
import {LinkService} from "./force-directed-graph/graph-component/services/event-tracking/link.service";
import {GraphDataService} from "./force-directed-graph/graph-component/services/graph-data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * list of nodes
   * @type {Node[]}
   */
  public nodes: Node[] = [];

  /**
   * list of links
   * @type {Link[]}
   */
  public links: Link[] = [];


  public loaded = false;

  constructor(
    private _http: HttpClient,
    private nodeService: NodeService,
    private linkService: LinkService,
    private graphDataService: GraphDataService
  ){}

  ngOnInit() {
    console.log(this);
/*    this._http.get<any>('./assets/nscs.json').subscribe(res=> {
      console.log(res);
      const nodeObs = of(res.elements.nodes.map(node => {
        console.log(node);
        const n = this.nodeService.makeNode(node.data.id, {properties: node.data});
        if(node.position) {
          n.x = node.position.x;
          n.y = node.position.y;
        }
        this.nodeService.setNode(n);
        return n;
      }));

      const linkObs = of(res.elements.edges.map(edge => {
        const linkArr = [];
        const source = this.nodeService.getById(edge.data.source);
        const target = this.nodeService.getById(edge.data.target);
        const l = this.linkService.makeLink(edge.data.id, source, target, {properties: edge.data});
        this.linkService.setLink(l);
        return l;
      }));


      const zipped: Observable<any> = from([nodeObs, linkObs]).pipe(zipAll());

      zipped.subscribe(res => {
       // this.nodes = res[0];
       // this.links = res[1];
        this.graphDataService.setGraph({
          nodes: this.graphDataService.getNodes(),
          links: this.graphDataService.getLinks()
        });
        this.loaded = true;

      })
    })*/

    this._http.get<any>('./assets/nscs.json').subscribe(res=> {
      const nodeObs = of(res.elements.nodes.map(node => {
        const n: Protein = this.nodeService.makeNode(node.data.id, {properties: node.data}) as Protein;
        if(node.position) {
          n.x = node.position.x;
          n.y = node.position.y;
        }
        this.nodeService.setNode(n);
        return n;
      }));

      const linkObs = of(res.elements.edges.map(edge => {
        const source = this.nodeService.getById(edge.data.source);
        const target = this.nodeService.getById(edge.data.target);
        const l = this.linkService.makeLink(edge.data.id, source, target, {properties: edge.data});
        this.linkService.setLink(l);
        return l;
      }));


      const zipped: Observable<any> = from([nodeObs, linkObs]).pipe(zipAll());

      zipped.subscribe(res => {
        this.graphDataService.setGraph({
          nodes: this.graphDataService.getNodes(),
          links: this.graphDataService.getLinks()
        });
        this.loaded = true;
      })
    })
  }

  filterGraph(event: Event) {
    const nodes = this._filterNodes(event);
    const edges = this._filterEdges(event, nodes);
   this.graphDataService.setGraph({
     nodes: nodes,
     links: edges
   });
  }

  _filterNodes(params: Event): Protein[]{
    let nodes: Protein[] = this.graphDataService.getNodes() as Protein[];
    Object.keys(params).forEach(param => {
      // skip iterating from the fade parameter
      if(param !== 'fade') {
        if (Array.isArray(params[param])) {
          if (params.fade === true) {
            nodes = nodes.map(node => {
              if (node[param] >= params[param][0] && node[param] <= params[param][1]) {
                node.tempcolor = null;
              } else {
                node.tempcolor = '#f6f6f6';
              }
              return node;
            });
          } else {
            nodes = nodes.filter(node => node[param] >= params[param][0] && node[param] <= params[param][1]);
          }
        }
      }
    });
    return nodes;
  }

  _filterEdges(params: Event, nodes : Protein[]){
    let links: Link[] = this.graphDataService.getLinks() as Link[];
    const currentNodes = nodes.map(node => node.uuid);
    links = links.filter(link => {
      const source: string = link.getSourceId();
      const target: string = link.getTargetId();
      return currentNodes.includes(source) && currentNodes.includes(target) || (source===target);
    });
    return links;
  }
}
