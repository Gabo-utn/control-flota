import { MovilComponent } from './componentes/movil/movil.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { HomeComponent } from './componentes/home/home.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareaComponent } from './componentes/tarea/tarea.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'grupos', component: GrupoComponent },
  { path: 'tarea', component: TareaComponent },
  { path: 'servicio', component: ServicioComponent },
  {path:'movil',component:MovilComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
