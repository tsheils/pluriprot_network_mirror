import {Component, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs/index";
import {zipAll} from "rxjs/internal/operators";
import {Link} from "./force-directed-graph/graph-component/models/link";
import {Node} from "./force-directed-graph/graph-component/models/node";
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
    this._http.get<any>('./assets/graph.json').subscribe(res=> {
      console.log(res);
      const nodeObs = of(res.elements.nodes.map(node => {
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
    })
  }
}
