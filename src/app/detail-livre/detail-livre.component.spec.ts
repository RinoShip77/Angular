import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLivreComponent } from './detail-livre.component';

describe('DetailLivreComponent', () => {
  let component: DetailLivreComponent;
  let fixture: ComponentFixture<DetailLivreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailLivreComponent]
    });
    fixture = TestBed.createComponent(DetailLivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
