import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefLayout } from './chief-layout';

describe('ChiefLayout', () => {
  let component: ChiefLayout;
  let fixture: ComponentFixture<ChiefLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiefLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiefLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
