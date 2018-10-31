import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeMenuComponent } from './node-menu.component';
import {NodeService} from '../../services/event-tracking/node.service';
import {NodeMenuControllerService} from '../../services/event-tracking/node-menu-controller.service';
import {GraphDataService} from '../../services/graph-data.service';
import {LinkService} from '../../services/event-tracking/link.service';
import {NodeExpandService} from '../../services/event-tracking/node-expand.service';

describe('NodeMenuComponent', () => {
  let component: NodeMenuComponent;
  let fixture: ComponentFixture<NodeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NodeService,
        NodeMenuControllerService,
        GraphDataService,
        LinkService,
        NodeExpandService
      ],
      declarations: [ NodeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
