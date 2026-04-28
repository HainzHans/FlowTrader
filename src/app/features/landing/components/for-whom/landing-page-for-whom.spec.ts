import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageForWhom } from './landing-page-for-whom';

describe('LandingPageForWhom', () => {
  let component: LandingPageForWhom;
  let fixture: ComponentFixture<LandingPageForWhom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageForWhom],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageForWhom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
