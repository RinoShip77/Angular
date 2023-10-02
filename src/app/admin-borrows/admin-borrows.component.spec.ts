import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBorrowsComponent } from './admin-borrows.component';

describe('AdminBorrowsComponent', () => {
  let component: AdminBorrowsComponent;
  let fixture: ComponentFixture<AdminBorrowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBorrowsComponent]
    });
    fixture = TestBed.createComponent(AdminBorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
