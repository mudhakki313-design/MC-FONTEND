import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadrasaLayout } from './madrasa-layout';

describe('MadrasaLayout', () => {
  let component: MadrasaLayout;
  let fixture: ComponentFixture<MadrasaLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadrasaLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadrasaLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
