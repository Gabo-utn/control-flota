import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioTareaComponent } from './servicio-tarea.component';

describe('ServicioTareaComponent', () => {
  let component: ServicioTareaComponent;
  let fixture: ComponentFixture<ServicioTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
