import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRecommendedComponent } from './page-recommended.component';

describe('PageRecommendedComponent', () => {
  let component: PageRecommendedComponent;
  let fixture: ComponentFixture<PageRecommendedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageRecommendedComponent]
    });
    fixture = TestBed.createComponent(PageRecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
