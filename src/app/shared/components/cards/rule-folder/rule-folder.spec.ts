import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleFolder } from './rule-folder';

describe('RuleFolder', () => {
  let component: RuleFolder;
  let fixture: ComponentFixture<RuleFolder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleFolder],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleFolder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
