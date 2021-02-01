import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Tarea } from '../modelo/tarea';


@Injectable({
  providedIn: 'root'
})
export class TareaService
extends ApiService<Tarea>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("tarea", http, app);
  }


}
