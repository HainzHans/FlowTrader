import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWinRate } from './dashboard-win-rate';

describe('DashboardWinRate', () => {
  let component: DashboardWinRate;
  let fixture: ComponentFixture<DashboardWinRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWinRate],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWinRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
