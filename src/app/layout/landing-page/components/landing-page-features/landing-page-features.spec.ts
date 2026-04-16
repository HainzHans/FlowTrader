import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageFeatures } from './landing-page-features';

describe('LandingPageFeatures', () => {
  let component: LandingPageFeatures;
  let fixture: ComponentFixture<LandingPageFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageFeatures],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageFeatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
