import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Grupo } from '../modelo/grupo';


@Injectable({
  providedIn: 'root'
})
export class GrupoService
extends ApiService<Grupo>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("grupo", http, app);
  }


}
