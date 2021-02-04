
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Servicio } from '../modelo/servicio';



@Injectable({
  providedIn: 'root'
})
export class ServicioService
extends ApiService<Servicio>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("servicio", http, app);
  }


}
