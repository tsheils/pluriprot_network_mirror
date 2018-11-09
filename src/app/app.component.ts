import {Component, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs/index";
import {zipAll} from "rxjs/internal/operators";
import {Link} from "./force-directed-graph/graph-component/models/link";
import {Node, Protein} from "./force-directed-graph/graph-component/models/node";
import {NodeService} from "./force-directed-graph/graph-component/services/event-tracking/node.service";
import {LinkService} from "./force-directed-graph/graph-component/services/event-tracking/link.service";
import {GraphDataService} from "./force-directed-graph/graph-component/services/graph-data.service";
import {DataParserService} from "./services/data-parser.service";

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

  dataMap: Map<string, any> = new Map<string, any>();


  public loaded = false;

  constructor(
    private _http: HttpClient,
    private dataParserService: DataParserService,
    private nodeService: NodeService,
    private linkService: LinkService,
    private graphDataService: GraphDataService
  ){}

  ngOnInit() {
    console.log(this);
     this.dataParserService.LoadData().subscribe(res => {
       this.dataMap = this.dataParserService.getDataMap();
       this.graphDataService.setGraph(this.dataMap.get('nscs'))
     });
     //console.log(data);
    }
   /* this._http.get<any>('./assets/nscs.json').subscribe(res => {
      const nodeObs = of(res.elements.nodes.map(node => {
        const n: Protein = this.nodeService.makeNode(node.data.id, {properties: node.data}) as Protein;
        if (node.position) {
          n.x = node.position.x;
          n.y = node.position.y;
        }
        if (node.data.id === '6685') {
          console.error(node);
          console.error(n);
          n.color = 'red';
        }
        this.nodeService.setNode(n);
        return n;
      }));

      const circles = [];
      const linkObs = of(res.elements.edges.map(edge => {
        const source = this.nodeService.getById(edge.data.source);
        const target = this.nodeService.getById(edge.data.target);
        if (source.uuid !== target.uuid) {
          if(edge.data.interaction === 'genetic'){
            source.color = 'red';
            target.color = 'red';
          }
          const l = this.linkService.makeLink(edge.data.id, source, target, {properties: edge.data});
          this.linkService.setLink(l);
          return l;
        } else {
          circles.push(edge);
          if (edge.id === '30189') {
            console.error(edge);
          }
          return null;
        }
      }));


      const zipped: Observable<any> = from([nodeObs, linkObs]).pipe(zipAll());
      zipped.subscribe(res => {
        console.log(circles);
        this.loaded = true;
        this.graphDataService.setGraph({
          nodes: this.graphDataService.getNodes(),
          links: this.graphDataService.getLinks()
        });
      })
    })
  }*/

  filterGraph(event: Event) {
    console.log(event);
    const nodes = this._filterNodes(event);
    const edges = this._filterEdges(event, nodes);
   this.graphDataService.setGraph({
     nodes: nodes,
     links: edges
   });
  }

  _filterNodes(params: Event): Protein[]{
    const data = params['data'] ? params['data'] : 'nscs';
    let nodes: Protein[] = this.dataMap.get(data).nodes as Protein[];
    Object.keys(params).forEach(param => {
      // skip iterating from the fade parameter
      if(param !== 'fade') {
        if (Array.isArray(params[param])) {
          if (params['fade'] === true) {
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
    const data = params['data'] ? params['data'] : 'nscs';
    let links: Link[] = this.dataMap.get(data).links as Link[];
    const currentNodes = nodes.map(node => node.uuid);
    links = links.filter(link => {
      const source: string = link.getSourceId();
      const target: string = link.getTargetId();
      return currentNodes.includes(source) && currentNodes.includes(target);
    });
    return links;
  }
}
