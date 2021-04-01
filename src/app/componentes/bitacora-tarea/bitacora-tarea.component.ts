import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { BitacoraTarea } from '../../modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service';

import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service';

import { ServicioTarea } from 'src/app/modelo/servicio-tarea';
import { ServicioTareaService } from 'src/app/servicios/servicio-tarea.service';
import { MovilBitacoraService } from 'src/app/servicios/movil-bitacora.service';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
 


@Component({
  selector: 'app-bitacora-tarea',
  templateUrl: './bitacora-tarea.component.html',
  styleUrls: ['./bitacora-tarea.component.css']
})
export class BitacoraTareaComponent implements OnInit {
   @Input() mobiId: number = 0;

  items : BitacoraTarea[]=[];
  seleccionado = new BitacoraTarea();

  form = new FormGroup({});
  columnas: string[] = ['tareNombre','bitaObservaciones','bitaCantidad','bitaCosto','acciones'];
  dataSource = new MatTableDataSource<BitacoraTarea>();

  mostrarFormularioBitacoraTarea = false;

  AuxId =-1;
  tareas: Tarea[] = [];

  servicioTarea: ServicioTarea[] = [];

  constructor(
    private bitacoraTareaService : BitacoraTareaService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog,
    private tareaService: TareaService,
    private servicioTareaService: ServicioTareaService,
    private movilBitacoraService : MovilBitacoraService,

  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.form = this.formBouilder.group({
      bitaId: [''],
      bitaMobiId: [''],
      bitaTareId: [''],
      bitaObservaciones: [''],
      bitaCantidad: [''],
      bitaCosto: [''],
      bitaFechaAlta: [''],
      bitaBorrado: [''],

      tareNombre: ['']
    })

    this.bitacoraTareaService.get(`bitaMobiId=${this.mobiId}`).subscribe(
      (bitatare) => {
        this.items = bitatare;
        this.actualizartabla();
      }
    )
    this.tareaService.get().subscribe(
      (tarea) => {
        this.tareas = tarea;
      }
      )

    this.servicioTareaService.get(`setaServId=${this.movilBitacoraService.mobiSelected.mobiServId}`).subscribe(
      (servTare) => {
        this.servicioTarea = servTare;
      }
    )
    
  }

  actualizartabla(){
    this.dataSource.data = this.items;
  }

  

  delete(seleccionado: BitacoraTarea){
    const dialog = this.matDialog.open(ConfirmarComponent);
    dialog.afterClosed().subscribe(
      (result) => {
        if(result) {
          seleccionado.bitaBorrado = 1;
          this.actualizartabla();
        }
      });
  }
  
  
  
  agregar(){
    this.AuxId;
    this.seleccionado = new BitacoraTarea();
    this.seleccionado.bitaId = this.AuxId

    this.mostrarFormularioBitacoraTarea = true;
    this.form.reset(this.seleccionado)

  }
  editar(seleccionado:BitacoraTarea)
  {
    this.mostrarFormularioBitacoraTarea = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado)

  }

  guardar()
  {
    if(!this.form.valid){
      return
    }
    Object.assign(this.seleccionado, this.form.value);
    
    this.seleccionado.bitaMobiId = this.mobiId;

    this.seleccionado.tareNombre = this.tareas.find(x => x.tareId == this.seleccionado.bitaTareId)!.tareNombre;
    this.bitacoraTareaService.items = this.bitacoraTareaService.items.filter(x => x.bitaId !== this.seleccionado.bitaId);
    this.bitacoraTareaService.items.push(this.seleccionado);

    this.mostrarFormularioBitacoraTarea = false;
    this.actualizartabla();

  }

  cancelar(){
    this.mostrarFormularioBitacoraTarea = false;
  }
  

}
