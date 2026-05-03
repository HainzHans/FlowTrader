import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentTrades } from './dashboard-recent-trades';

describe('DashboardRecentTrades', () => {
  let component: DashboardRecentTrades;
  let fixture: ComponentFixture<DashboardRecentTrades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecentTrades],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecentTrades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
