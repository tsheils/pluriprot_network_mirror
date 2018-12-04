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
import {environment} from "src/environments/environment.prod";
import {D3Service} from "./force-directed-graph/graph-component/services/event-tracking/d3.service";

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

  graph: any;

  constructor(
    private _http: HttpClient,
    private dataParserService: DataParserService,
    private d3Service: D3Service,
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

  /*  this.dataParserService.LoadData().subscribe(res => {
      console.log(res);
      this.graphDataService.setGraph({
        nodes: this.graphDataService.getNodes(),
        links: this.graphDataService.getLinks()
      });
*/

      // this._http.get<any>(environment.parsedData).subscribe(res => {
      // console.log(res);
      //     this.graphDataService.setGraph(res);
      // this.loaded = true;
   // });



     /*this.dataParserService.LoadData().subscribe(res => {
       console.log(res);
       this.graphDataService.setGraph({
         nodes: this.graphDataService.getNodes(),
         links: this.graphDataService.getLinks()
       });

       this.graph = {
         nodes: this.graphDataService.getNodes(),
         links: this.graphDataService.getLinks()
       }
      // this.dataMap = this.dataParserService.getDataMap();
//       this.graphDataService.setGraph(this.dataMap.get('nscs'))
     });*/
     //console.log(data);
    }

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
    //let nodes: Protein[] = this.graphDataService.getNodes() as Protein[];
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
    if(params['no_data'] === true){
     nodes = nodes.filter(node => {
       return node.hESC_NSC_Fold_Change !==-100
     });

    }
    if(params['subgraph']) {
      const node = nodes.filter(node => node.name === params['subgraph']);
      this.nodeService.hoveredNode(node)
      this.d3Service._manualClick(node[0], this.graphDataService.returnGraph());
    }

    return nodes;
  }

  _filterEdges(params: Event, nodes : Protein[]){
    const data = params['data'] ? params['data'] : 'nscs';
    let links: Link[] = this.dataMap.get(data).links as Link[];
    // let links: Link[] = this.graphDataService.getLinks();
    const currentNodes = nodes.map(node => node.uuid);
     links = links.filter(link => {
      const source: string = link.getSourceId();
      const target: string = link.getTargetId();
      return currentNodes.includes(source) && currentNodes.includes(target);
    });
    return links;
  }
}
