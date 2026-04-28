import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageHero } from './landing-page-hero';

describe('LandingPageHero', () => {
  let component: LandingPageHero;
  let fixture: ComponentFixture<LandingPageHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageHero],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
