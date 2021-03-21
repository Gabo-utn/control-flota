import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { BitacoraTarea } from '../../modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service';

@Component({
  selector: 'app-bitacora-tarea',
  templateUrl: './bitacora-tarea.component.html',
  styleUrls: ['./bitacora-tarea.component.css']
})
export class BitacoraTareaComponent implements OnInit { @Input() mobiId: number = 0;

  items : BitacoraTarea[]=[];
  seleccionado = new BitacoraTarea();

  form = new FormGroup({});
  columnas: string[] = ['tareNombre','bitaObservaciones','bitaCantidad','bitaCosto','acciones'];
  dataSource = new MatTableDataSource<BitacoraTarea>();

  mostrarFormularioBitacoraTarea = false;

  constructor(
    private bitacoraTareaService : BitacoraTareaService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

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
  }

  actualizartabla(){
    this.dataSource.data = this.items;
  }

  edit(seleccionado: BitacoraTarea){
  }

  delete(seleccionado: BitacoraTarea){
  }


}
