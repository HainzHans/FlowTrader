import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAccountOverview } from './dashboard-account-overview';

describe('DashboardAccountOverview', () => {
  let component: DashboardAccountOverview;
  let fixture: ComponentFixture<DashboardAccountOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAccountOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAccountOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
