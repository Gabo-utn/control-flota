import { Injectable } from '@angular/core';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

    sertar : ServicioTarea[] = [];
    gruser : GrupoServicio[] = [];

  constructor(){}
}
