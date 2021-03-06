import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { GrupoServicio } from 'src/app/modelo/grupo-servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { GrupoServicioService } from 'src/app/servicios/grupo-servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';



@Component({
  selector: 'app-grupo-servicio',
  templateUrl: './grupo-servicio.component.html',
  styleUrls: ['./grupo-servicio.component.css']
})
export class GrupoServicioComponent implements OnInit {

  @Input() grupId: number = 0;


  gruposervicios: GrupoServicio[] = [];
  seleccionado = new GrupoServicio();

  columnas: string[] = ['servNombre', 'grusPeriodo', 'grusKM', 'acciones'];
  dataSource = new MatTableDataSource<GrupoServicio>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux: number = -1;


  constructor(private grupoServicioService: GrupoServicioService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public global:GlobalService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grusId: [''],
      grusGrupId: [''],
      grusServId: [''],
      grusPeriodo: [''],
      grusKM: [''],
      grusFecha: [''],
      grusBorrado: [''],
      grusFechaAlta: [''],
      servNombre: [''],
    });

    this.grupoServicioService.get(`grusGrupId=${this.grupId}`).subscribe(
      (grupoServicio) => {
        this.global.itemsServ = grupoServicio;
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
    this.dataSource.data = this.global.itemsServ.filter(borrado => borrado.grusBorrado == false);
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

      if (result) {
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

    this.seleccionado.servNombre = this.servicios.find(serv => serv.servId == this.seleccionado.grusServId)!.servNombre;
    this.global.itemsServ = this.global.itemsServ.filter(x => x.grusId != this.seleccionado.grusId);
    this.global.itemsServ.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
