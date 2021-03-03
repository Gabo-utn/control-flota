
import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GlobalService } from '../../servicios/global.service';
import { ServicioTareaService } from '../../servicios/servicio-tarea.service';
import { ServicioTarea } from '../../modelo/servicio-tarea'
import { Tarea } from '../../modelo/tarea';

@Component({
  selector: 'app-servicio-tarea',
  templateUrl: './servicio-tarea.component.html',
  styleUrls: ['./servicio-tarea.component.css']
})
export class ServicioTareaComponent implements OnInit {

  @Input() servId: number = 0;

  serviciotareas: ServicioTarea[] = [];
  seleccionado = new ServicioTarea();

  columnas: string[] = ['tareNombre',  'acciones'];
  dataSource = new MatTableDataSource<ServicioTarea>();


  form = new FormGroup({});
  mostrarFormulario = false;

  tareas: Tarea[] = [];
  idAux: number = -1;


  constructor(
    public global:GlobalService,
    private tareaService: TareaService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private servicioTareaService:ServicioTareaService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      setaId: [''],
      setaServId: [''],
      setaTareId: [''],
      setaBorrado: [''],
      setaFechaAlta: [''],
      tareNombre: [''],
    });

    this.servicioTareaService.get(`setaServId=${this.servId}`).subscribe(
      (servicioTarea) => {
        this.global.items = servicioTarea;
        this.actualizarTabla();
      }
    );

    this.tareaService.get().subscribe(
      (Tarea) => {
        this.tareas = Tarea;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.global.items.filter(borrado => borrado.setaBorrado==false);
  }

  agregar() {

    this.idAux--;
    this.seleccionado = new ServicioTarea();
    this.seleccionado.setaId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: ServicioTarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.setaBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: ServicioTarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.tareNombre = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareNombre;

    if(this.seleccionado.setaId > 0){
      const elemento = this.serviciotareas.find(item => item.setaId == this.seleccionado.setaId);
      this.serviciotareas.splice(this.seleccionado.setaId, 1, elemento!);
    }else{
      this.global.items.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
