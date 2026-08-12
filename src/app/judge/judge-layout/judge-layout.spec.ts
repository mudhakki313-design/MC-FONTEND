import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeLayout } from './judge-layout';

describe('JudgeLayout', () => {
  let component: JudgeLayout;
  let fixture: ComponentFixture<JudgeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
