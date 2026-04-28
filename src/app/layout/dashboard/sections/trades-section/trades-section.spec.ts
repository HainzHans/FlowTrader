import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesSection } from './trades-section';

describe('TradesSection', () => {
  let component: TradesSection;
  let fixture: ComponentFixture<TradesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesSection],
    }).compileComponents();

    fixture = TestBed.createComponent(TradesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
