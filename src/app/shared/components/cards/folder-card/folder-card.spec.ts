import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderCard } from './folder-card';

describe('FolderCard', () => {
  let component: FolderCard;
  let fixture: ComponentFixture<FolderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FolderCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
