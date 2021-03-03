import { Injectable } from '@angular/core';
import { ServicioTarea } from '../modelo/servicio-tarea';
import { GrupoServicio } from '../modelo/grupo-servicio';
import { MovilServicio } from '../modelo/movil-servicio';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  items: ServicioTarea[] = [];
  itemsServ : GrupoServicio[] = [];
  itemsMov : MovilServicio[] = [];

  constructor() { }
}
