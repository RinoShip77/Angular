import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBorrowComponent } from './details-borrow.component';

describe('DetailsBorrowComponent', () => {
  let component: DetailsBorrowComponent;
  let fixture: ComponentFixture<DetailsBorrowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsBorrowComponent]
    });
    fixture = TestBed.createComponent(DetailsBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});