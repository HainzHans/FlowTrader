import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSection } from './accounts-section';

describe('AccountsSection', () => {
  let component: AccountsSection;
  let fixture: ComponentFixture<AccountsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
