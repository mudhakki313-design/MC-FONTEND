import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadrasaResults } from './madrasa-results';

describe('MadrasaResults', () => {
  let component: MadrasaResults;
  let fixture: ComponentFixture<MadrasaResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadrasaResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadrasaResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
