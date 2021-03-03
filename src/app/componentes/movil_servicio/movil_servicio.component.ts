import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';

import { MovilServicio } from 'src/app/modelo/movil-servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { MovilServicioService } from 'src/app/servicios/movil-servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';

import{GlobalService} from 'src/app/servicios/global.service'




@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil_servicio.component.html',
  styleUrls: ['./movil_servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() grupId: number = 0;


  movilservicios: MovilServicio[] = [];
  seleccionado = new MovilServicio();

  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux: number = -1;

  columnas: string[] = [
    'servNombre',
    'mosePeriodo',
    'moseKM',
    'acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();


  constructor(private MovilServicioService: MovilServicioService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public global: GlobalService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moseId: [''],
      moseMoviId: [''],
      moseServId: ['', Validators.required],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseBorrado: [''],
      moseFechaAlta: [''],
      servNombre: [''],

    });

    this.MovilServicioService.get(`moseMoviId=${this.grupId}`).subscribe(
      (MovilServicio) => {
        this.global.itemsMov = MovilServicio;
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
    this.dataSource.data = this.global.itemsMov.filter(borrado => borrado.moseBorrado==false);
  }

  agregar() {
    this.idAux--;
    this.seleccionado = new MovilServicio();
    this.seleccionado.moseId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: MovilServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.moseBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: MovilServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.servNombre = this.servicios.find(servicio => servicio.servId == this.seleccionado.moseId)!.servNombre;
    this.seleccionado.mosePeriodo = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseId)!.servPeriodo;
    this.seleccionado.moseKM = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseId)!.servKM;
    this.seleccionado.moseFecha = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseId)!.servFecha;

    if(this.seleccionado.moseId > 0){
      const elemento = this.movilservicios.find(itemsMov => itemsMov.moseId == this.seleccionado.moseId);
      this.movilservicios.splice(this.seleccionado.moseId, 1, elemento!);
    }else{
      this.global.itemsMov.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
