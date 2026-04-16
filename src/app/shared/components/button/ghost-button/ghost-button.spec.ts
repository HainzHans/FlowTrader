import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostButton } from './ghost-button';

describe('GhostButton', () => {
  let component: GhostButton;
  let fixture: ComponentFixture<GhostButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostButton],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
