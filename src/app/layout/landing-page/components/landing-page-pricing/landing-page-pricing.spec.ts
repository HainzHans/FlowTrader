import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagePricing } from './landing-page-pricing';

describe('LandingPagePricing', () => {
  let component: LandingPagePricing;
  let fixture: ComponentFixture<LandingPagePricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPagePricing],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPagePricing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
