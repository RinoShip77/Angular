import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnComponent } from './detail-return.component';

describe('DetailReturnComponent', () => {
  let component: DetailReturnComponent;
  let fixture: ComponentFixture<DetailReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailReturnComponent]
    });
    fixture = TestBed.createComponent(DetailReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
