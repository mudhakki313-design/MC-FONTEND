import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadrasaCompetitions } from './madrasa-competitions';

describe('MadrasaCompetitions', () => {
  let component: MadrasaCompetitions;
  let fixture: ComponentFixture<MadrasaCompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadrasaCompetitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadrasaCompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
