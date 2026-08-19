import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefProfile } from './chief-profile';

describe('ChiefProfile', () => {
  let component: ChiefProfile;
  let fixture: ComponentFixture<ChiefProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiefProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiefProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
