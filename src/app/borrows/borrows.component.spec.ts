import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowsComponent } from './borrows.component';

describe('BorrowsComponent', () => {
  let component: BorrowsComponent;
  let fixture: ComponentFixture<BorrowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowsComponent]
    });
    fixture = TestBed.createComponent(BorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
