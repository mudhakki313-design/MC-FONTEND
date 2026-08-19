import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeProfile } from './judge-profile';

describe('JudgeProfile', () => {
  let component: JudgeProfile;
  let fixture: ComponentFixture<JudgeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
