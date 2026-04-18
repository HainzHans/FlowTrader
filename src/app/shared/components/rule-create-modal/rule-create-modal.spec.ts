import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCreateModal } from './rule-create-modal';

describe('RuleCreateModal', () => {
  let component: RuleCreateModal;
  let fixture: ComponentFixture<RuleCreateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleCreateModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleCreateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
