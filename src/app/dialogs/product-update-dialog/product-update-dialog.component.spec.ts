import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateDialogComponent } from './product-update-dialog.component';

describe('ProductUpdateDialogComponent', () => {
  let component: ProductUpdateDialogComponent;
  let fixture: ComponentFixture<ProductUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductUpdateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
