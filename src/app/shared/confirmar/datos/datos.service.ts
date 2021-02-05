import { Injectable } from '@angular/core';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

    sertar : ServicioTarea[] = [];

  constructor(){}
}
