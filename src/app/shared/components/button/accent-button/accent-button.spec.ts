import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccentButton } from './accent-button';

describe('AccentButton', () => {
  let component: AccentButton;
  let fixture: ComponentFixture<AccentButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccentButton],
    }).compileComponents();

    fixture = TestBed.createComponent(AccentButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
