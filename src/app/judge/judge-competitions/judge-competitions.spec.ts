import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeCompetitions } from './judge-competitions';

describe('JudgeCompetitions', () => {
  let component: JudgeCompetitions;
  let fixture: ComponentFixture<JudgeCompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeCompetitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeCompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
