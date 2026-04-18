import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleItem } from './rule-item';

describe('RuleItem', () => {
  let component: RuleItem;
  let fixture: ComponentFixture<RuleItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleItem],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
