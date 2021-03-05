import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ApiService } from '../core/api-service';
import {AppConfigService} from '../core/config.service';

import { BitacoraTarea } from '../modelo/bitacora-tarea';

@Injectable({
  providedIn: 'root'
})
export class BitacoraTareaService
  extends ApiService<BitacoraTarea>{

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  )
  {
    super('bitacora-tarea',http,app)
  }
}
