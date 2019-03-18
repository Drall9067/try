import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbarComponent } from './dashbar.component';

describe('DashbarComponent', () => {
  let component: DashbarComponent;
  let fixture: ComponentFixture<DashbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
