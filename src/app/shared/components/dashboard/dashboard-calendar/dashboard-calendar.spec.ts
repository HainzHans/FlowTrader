import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCalendar } from './dashboard-calendar';

describe('DashboardCalendar', () => {
  let component: DashboardCalendar;
  let fixture: ComponentFixture<DashboardCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
