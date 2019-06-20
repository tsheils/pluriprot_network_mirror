import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SctlNavbarComponent } from './sctl-navbar.component';

describe('SctlNavbarComponent', () => {
  let component: SctlNavbarComponent;
  let fixture: ComponentFixture<SctlNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SctlNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SctlNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
