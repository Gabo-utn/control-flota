import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './componentes/home/home.component';
import { AppConfigService } from './core/config.service';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { TareaComponent } from './componentes/tarea/tarea.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { ConfirmarComponent } from './shared/confirmar/confirmar.component';
import { ServicioTareaComponent } from './componentes/servicio-tarea/servicio-tarea.component';
import { GrupoServicioComponent } from './componentes/grupo-servicio/grupo-servicio.component';
import { MovilServicioComponent } from './componentes/movil_servicio/movil_servicio.component';
import { MovilComponent } from './componentes/movil/movil.component';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GrupoComponent,
    TareaComponent,
    ServicioComponent,
    ConfirmarComponent,

    GrupoServicioComponent,
    MovilServicioComponent,
    MovilComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule


  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfig(config: AppConfigService) {
  return () => config.load();
}
