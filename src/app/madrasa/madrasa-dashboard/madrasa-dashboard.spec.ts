import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadrasaDashboard } from './madrasa-dashboard';

describe('MadrasaDashboard', () => {
  let component: MadrasaDashboard;
  let fixture: ComponentFixture<MadrasaDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadrasaDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadrasaDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
