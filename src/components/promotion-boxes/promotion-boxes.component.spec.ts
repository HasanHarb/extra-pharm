import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionBoxesComponent } from './promotion-boxes.component';

describe('PromotionBoxesComponent', () => {
  let component: PromotionBoxesComponent;
  let fixture: ComponentFixture<PromotionBoxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionBoxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
