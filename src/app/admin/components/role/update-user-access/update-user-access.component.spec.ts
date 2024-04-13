import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAccessComponent } from './update-user-access.component';

describe('UpdateUserAccessComponent', () => {
  let component: UpdateUserAccessComponent;
  let fixture: ComponentFixture<UpdateUserAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
