import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowDetailsComponent } from './borrow-details.component';

describe('BorrowDetailsComponent', () => {
  let component: BorrowDetailsComponent;
  let fixture: ComponentFixture<BorrowDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowDetailsComponent]
    });
    fixture = TestBed.createComponent(BorrowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
