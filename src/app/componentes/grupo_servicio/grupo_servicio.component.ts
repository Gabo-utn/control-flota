import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { GrupoServicioService } from 'src/app/servicios/grupo_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/confirmar/datos/datos.service';



@Component({
  selector: 'app-grupo-servicio',
  templateUrl: './grupo_servicio.component.html',
  styleUrls: ['./grupo_servicio.component.css']
})
export class GrupoServicioComponent implements OnInit {

  @Input() grupId: number = 0;


  gruposervicios: GrupoServicio[] = [];
  seleccionado = new GrupoServicio();

  columnas: string[] = ['grusId', 'servNombre', 'grusPeriodo', 'grusKM', 'grusFecha','acciones'];
  dataSource = new MatTableDataSource<GrupoServicio>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux: number = -1;


  constructor(private grupoServicioService: GrupoServicioService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grusId: [''],
      grusGrupId: [''],
      grusServId: ['', Validators.required],
      grusPeriodo: [''],
      grusKM: [''],
      grusFecha: [''],
      grusBorrado: [''],
      grusFechaAlta: [''],
      servNombre: [''],
    });

    this.grupoServicioService.get(`grusGrupId=${this.grupId}`).subscribe(
      (grupoServicio) => {
        this.datosService.gruser = grupoServicio;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.datosService.gruser.filter(borrado => borrado.grusBorrado==false);
  }

  agregar() {
    this.idAux--;
    this.seleccionado = new GrupoServicio();
    this.seleccionado.grusId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: GrupoServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.grusBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: GrupoServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.servNombre = this.servicios.find(servicio => servicio.servId == this.seleccionado.grusServId)!.servNombre;
    this.seleccionado.grusPeriodo = this.servicios.find(servicio  => servicio.servId == this.seleccionado.grusServId)!.servPeriodo;
    this.seleccionado.grusKM = this.servicios.find(servicio  => servicio.servId == this.seleccionado.grusServId)!.servKM;
    this.seleccionado.grusFecha = this.servicios.find(servicio  => servicio.servId == this.seleccionado.grusServId)!.servFecha;

    if(this.seleccionado.grusId > 0){
      const elemento = this.gruposervicios.find(gruser => gruser.grusId == this.seleccionado.grusId);
      this.gruposervicios.splice(this.seleccionado.grusId, 1, elemento!);
    }else{
      this.datosService.gruser.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
