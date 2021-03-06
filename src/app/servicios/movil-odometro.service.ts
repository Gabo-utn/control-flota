import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ApiService } from '../core/api-service';
import {AppConfigService} from '../core/config.service';

import { MovilOdometro } from '../modelo/movil-odometro';

@Injectable({
  providedIn: 'root'
})
export class MovilOdometroService
  extends ApiService<MovilOdometro> {

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) { super("movil-odometro",http,app) }
}
