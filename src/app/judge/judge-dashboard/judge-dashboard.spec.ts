import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeDashboard } from './judge-dashboard';

describe('JudgeDashboard', () => {
  let component: JudgeDashboard;
  let fixture: ComponentFixture<JudgeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
