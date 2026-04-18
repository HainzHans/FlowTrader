import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleFolderModal } from './rule-folder-modal';

describe('RuleFolderModal', () => {
  let component: RuleFolderModal;
  let fixture: ComponentFixture<RuleFolderModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleFolderModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleFolderModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
