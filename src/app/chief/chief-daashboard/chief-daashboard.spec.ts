import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefDaashboard } from './chief-daashboard';

describe('ChiefDaashboard', () => {
  let component: ChiefDaashboard;
  let fixture: ComponentFixture<ChiefDaashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiefDaashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiefDaashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
