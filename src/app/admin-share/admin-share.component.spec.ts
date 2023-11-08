import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShareComponent } from './admin-share.component';

describe('AdminShareComponent', () => {
  let component: AdminShareComponent;
  let fixture: ComponentFixture<AdminShareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminShareComponent]
    });
    fixture = TestBed.createComponent(AdminShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
