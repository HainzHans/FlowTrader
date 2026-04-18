import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulePriorityBadge } from './rule-priority-badge';

describe('RulePriorityBadge', () => {
  let component: RulePriorityBadge;
  let fixture: ComponentFixture<RulePriorityBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulePriorityBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(RulePriorityBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
