import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionStats } from './section-stats';

describe('SectionStats', () => {
  let component: SectionStats;
  let fixture: ComponentFixture<SectionStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionStats],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
