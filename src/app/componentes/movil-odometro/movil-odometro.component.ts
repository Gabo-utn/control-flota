import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId: number = 0;

  seleccionado = new MovilOdometro();

  items : MovilOdometro[] = [];

  columnas : string[] = ['modoFecha','modoOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();
  form = new FormGroup({});

  mostrarFormulario = false;

  constructor(
    private movilOdometroService: MovilOdometroService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      modoId:[''],
      modoMoviId:[''],
      modoFecha:[''],
      modoOdometro:[''],
      modoFechaAlta:[''],
      modoBorrado:['']
    });

    this.movilOdometroService.get().subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {

  }

  delete(row: MovilOdometro) {

  }

  edit(seleccionado: MovilOdometro) {

  }

  guardar() {

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

}
