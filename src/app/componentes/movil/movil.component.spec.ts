import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilComponent } from './movil.component';

describe('MovilComponent', () => {
  let component: MovilComponent;
  let fixture: ComponentFixture<MovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
