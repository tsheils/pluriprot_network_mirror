import { Injectable } from '@angular/core';
import {from, Observable, of} from "rxjs/index";
import {map, zipAll} from "rxjs/operators";
import {NodeService} from "../force-directed-graph/graph-component/services/event-tracking/node.service";
import {LinkService} from "../force-directed-graph/graph-component/services/event-tracking/link.service";
import {Protein} from "../force-directed-graph/graph-component/models/node";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {GraphDataService} from "../force-directed-graph/graph-component/services/graph-data.service";

interface FileData {
  origin: string;
  data: any;
}

const DATAFILES = environment.dataUrls;


@Injectable({
  providedIn: 'root'
})
export class DataParserService {

  dataMap: Map<string, any> = new Map<string, any>();

  constructor(
    private _http: HttpClient,
    private nodeService: NodeService,
    private linkService: LinkService,
    private graphDataService: GraphDataService
  ) { }



  private _fetchFile(url: string) {
    return this._http.get<any[]>(url);
  }

  LoadData(): Observable<any> {
    return from(DATAFILES.map(file => {
      const fileData: FileData = {origin: file.origin, data: this._fetchFile(file.url)};
      return fileData;
    })).pipe(
      map(res => {
        return res.data.pipe(
          map(response => {
            const data: FileData = {origin: res.origin, data: response};
            return this._parseData(data);
          })
        );
      }),
      zipAll()
    )/*.subscribe(res => {
      console.log(res);
      return this.dataMap;
    });*/
  }

  private _parseData(data: any) {
    const nodeObs = of(data.data.elements.nodes.map(node => {
      const n: Protein = this.nodeService.makeNode(node.data.id, {properties: node.data}) as Protein;
      if (node.position) {
        n.x = node.position.x;
        n.y = node.position.y;
      }
      // n.origin = data.origin;
      this.nodeService.setNode(n);
      return n;
    }));

    const circles = [];
    const linkObs = of(data.data.elements.edges.map(edge => {
      const names = edge.data.name.split(' ');
      const source: Protein = this.nodeService.getById(names[0].trim()) as Protein;
      const target: Protein = this.nodeService.getById(names[2].trim()) as Protein;
      if (source.gene !== target.gene) {
        const l = this.linkService.makeLink(edge.data.id, source, target, {properties: edge.data});
        this.linkService.setLink(l);
        return l;
      }
    }));


    const zipped: Observable<any> = from([nodeObs, linkObs]).pipe(zipAll());

    return zipped.subscribe(res => {
      this.dataMap.set(data.origin, {
        nodes: res[0],
        links: res[1].filter(link => link != undefined)
      });
      this.graphDataService.clearGraph();
      return res;
    })

  }

  getDataMap(): Map<string,any> {
    return this.dataMap;
  }
}
