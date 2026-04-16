import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageFooter } from './landing-page-footer';

describe('LandingPageFooter', () => {
  let component: LandingPageFooter;
  let fixture: ComponentFixture<LandingPageFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
