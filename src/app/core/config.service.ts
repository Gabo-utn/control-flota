import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private configUrl = 'assets/config.json';

  config= new Config();

  constructor(private http: HttpClient) {
  }

  // se carga desde app.module
  load() {
   return this.http.get<Config>(this.configUrl)
   .toPromise()
   .then((data) => {
        this.config = data;
      });
  }

}
