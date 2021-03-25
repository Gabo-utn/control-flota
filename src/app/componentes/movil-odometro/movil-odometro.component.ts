import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';
import { Movil } from '../../modelo/movil';
import { MovilService } from '../../servicios/movil.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { AvisoComponent } from 'src/app/shared/aviso/aviso/aviso.component';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId: number = 0;

  seleccionado = new MovilOdometro();
  items : MovilOdometro[] = [];

  columnas : string[] = ['modoFecha', 'modoOdometro', 'acciones'];

  dataSource = new MatTableDataSource<MovilOdometro>();
  form = new FormGroup({});

  mostrarFormulario = false;
  label = 'Agregar Nuevo Odometro';

  moviles: Movil[] = [];
  movil = new Movil();

  

  constructor(
    private movilOdometroService: MovilOdometroService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog,
    private movilService: MovilService,
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
    this.movilService.get("activo=1").subscribe(
      (movil) => {
        this.moviles = movil;
      } 
     )

  }
  

  actualizarTabla() {
    this.dataSource.data = this.items;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {this.form.reset();
    this.form.reset();
    this.seleccionado = new MovilOdometro();
    this.mostrarFormulario = true;

  }

  delete(row: MovilOdometro) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);

        if (result) {
          this.movilOdometroService.delete(this.seleccionado.modoId).subscribe(
            () => {
              this.items = this.items.filter( x => x.modoId !== this.seleccionado.modoId);
              this.actualizarTabla();
            });
        }
      });

  }

  edit(seleccionado: MovilOdometro) {
    this.label = 'Editar Odometro';
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
    this.mostrarFormulario = true;

  }

  
  guardar() {
    if (!this.form.valid) {
      return;
  
    }if(this.seleccionado.modoId){
    // editar odometro
    this.seleccionado.modoOdometro = this.form.value.modoOdometro;
      this.seleccionado.modoFecha = this.form.value.modoFecha;

      this.movilOdometroService.put(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.modoId != this.seleccionado.modoId);
      this.items.push(this.seleccionado);
    //agregar odometro
     //agregar odometro
     this.seleccionado.modoOdometro = this.form.value.modoOdometro;
     this.seleccionado.modoFecha = this.form.value.modoFecha;
     this.seleccionado.modoMoviId = this.moviId;

     this.movilOdometroService.post(this.seleccionado).subscribe();
     this.items = this.items.filter(x => x.modoId != this.seleccionado.modoId);
     this.items.push(this.seleccionado);
  }

  this.form.reset();
  this.actualizarTabla();
  
 
}  

cancelar() {  this.form.reset();
  this.actualizarTabla();
  this.label = 'Agregar Nuevo Odometro'
  this.mostrarFormulario = false;


}

}
