import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPnlChart } from './dashboard-pnl-chart';

describe('DashboardPnlChart', () => {
  let component: DashboardPnlChart;
  let fixture: ComponentFixture<DashboardPnlChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPnlChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPnlChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
