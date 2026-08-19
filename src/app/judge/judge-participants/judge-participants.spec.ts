import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeParticipants } from './judge-participants';

describe('JudgeParticipants', () => {
  let component: JudgeParticipants;
  let fixture: ComponentFixture<JudgeParticipants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeParticipants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeParticipants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
