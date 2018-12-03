import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForceDirectedGraphComponent } from './force-directed-graph/force-directed-graph.component';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {D3Service} from "./force-directed-graph/graph-component/services/event-tracking/d3.service";
import {MaterialModule} from "../assets/material/material.module";
import {NodeMenuComponent} from "./force-directed-graph/graph-component/shared-components/node-menu/node-menu.component";
import {ClickableLinkDirective} from "./force-directed-graph/graph-component/directives/clickable-link.directive";
import {ClickableNodeDirective} from "./force-directed-graph/graph-component/directives/clickable-node.directive";
import {DraggableDirective} from "./force-directed-graph/graph-component/directives/draggable.directive";
import {HoverableNodeDirective} from "./force-directed-graph/graph-component/directives/hoverable-node.directive";
import {HoverableLinkDirective} from "./force-directed-graph/graph-component/directives/hoverable-link.directive";
import {ZoomableDirective} from "./force-directed-graph/graph-component/directives/zoomable.directive";
import {LinkVisualComponent} from "./force-directed-graph/graph-component/shared-components/link-visual/link-visual.component";
import {NodeVisualComponent} from "./force-directed-graph/graph-component/shared-components/node-visual/node-visual.component";
import {GraphDataService} from "./force-directed-graph/graph-component/services/graph-data.service";
import {NodeService} from "./force-directed-graph/graph-component/services/event-tracking/node.service";
import {LinkService} from "./force-directed-graph/graph-component/services/event-tracking/link.service";
import {NodeMenuControllerService} from "./force-directed-graph/graph-component/services/event-tracking/node-menu-controller.service";
import { NodeDetailsBoxComponent } from './force-directed-graph/graph-component/shared-components/node-details-box/node-details-box.component';
import { GraphMenuComponent } from './force-directed-graph/graph-component/shared-components/graph-menu/graph-menu.component';
import { RangeSliderComponent } from './tools/range-slider/range-slider.component';
import { D3ColorLegendComponent } from './tools/d3-color-legend/d3-color-legend.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchComponent} from "./tools/search-component/search.component";
import {HighlightPipe} from "./tools/search-component/highlight.pipe";
import { TreeViewerComponent } from './tools/tree-viewer/tree-viewer.component';
import {GraphClickDirective} from "./force-directed-graph/graph-component/directives/graph-click.directive";

@NgModule({
  declarations: [
    AppComponent,
    NodeVisualComponent,
    LinkVisualComponent,
    ZoomableDirective,
    HoverableLinkDirective,
    HoverableNodeDirective,
    DraggableDirective,
    ClickableNodeDirective,
    ClickableLinkDirective,
    GraphClickDirective,
    NodeMenuComponent,
    ForceDirectedGraphComponent,
    NodeDetailsBoxComponent,
    GraphMenuComponent,
    RangeSliderComponent,
    D3ColorLegendComponent,
    HighlightPipe,
    SearchComponent,
    TreeViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    D3Service,
    NodeService,
    LinkService,
    GraphDataService,
    NodeMenuControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
