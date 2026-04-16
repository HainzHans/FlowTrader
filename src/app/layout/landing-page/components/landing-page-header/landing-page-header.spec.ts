import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageHeader } from './landing-page-header';

describe('LandingPageHeader', () => {
  let component: LandingPageHeader;
  let fixture: ComponentFixture<LandingPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
