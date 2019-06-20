import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HhsBannerComponent } from './hhs-banner.component';

describe('HhsBannerComponent', () => {
  let component: HhsBannerComponent;
  let fixture: ComponentFixture<HhsBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HhsBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HhsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
