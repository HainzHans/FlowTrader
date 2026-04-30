import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupsSection } from './setups-section';

describe('SetupsSection', () => {
  let component: SetupsSection;
  let fixture: ComponentFixture<SetupsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
