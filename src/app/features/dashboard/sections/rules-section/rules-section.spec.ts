import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesSection } from './rules-section';

describe('RulesSection', () => {
  let component: RulesSection;
  let fixture: ComponentFixture<RulesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesSection],
    }).compileComponents();

    fixture = TestBed.createComponent(RulesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
