import { Component,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilService } from '../../servicios/movil.service';
import { Movil } from '../../modelo/movil';

import { MovilGrupoService } from '../../servicios/movil-grupo';
import { MovilGrupo} from 'src/app/modelo/movil-grupo';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AvisoComponent } from 'src/app/shared/aviso/aviso/aviso.component'



@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit {

  items : Movil[] = [];
  seleccionado = new Movil();

  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones'];
  dataSource = new MatTableDataSource<Movil>();

  form = new FormGroup({});
  
  mostrarFormularioAgregarMovil = false;
  mostrarFormularioMantenimiento = false;
  mostrarFormularioEditarMovil = false;
  editarMovilF = false;


  mostrarFormulario = false;

  constructor(
    private movilServicio : MovilService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      moviId: [''],
      moviModoFecha: [''],
      moviModoOdometro: [''],
      moviFechaAlta: [''],
      moviBorrado: [''],
      patente: [''],
      descripcion: [''],
      dependencia: [''],
      marca: [''],
      modelo: [''],
      anio: [''],
      chasis: [''],
      numeromovil: [''],
      color: [''],
      seguro: [''],
      poliza: [''],
      numeromotor: ['']
    })

    this.movilServicio.get("activo=1").subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    )

  }

  actualizarTabla() {
    this.dataSource.data = this.items.filter(
      borrado => !(borrado.moviBorrado)
    );
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verMas(seleccionado:Movil) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

   // this.MovilGrupoService.get(`mogrMoviId=${this.seleccionado.moviId}`).subscribe(
     // (grupos) => {
       //this.gruposMovil = grupos;
  }

  agregar() {
    this.mostrarFormularioAgregarMovil = true;

  }

  delete(row: Movil) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result => {

      console.log(`Dialog result: ${result}`);

      if (result) {

        //this.seleccionado = Movil;

        this.movilServicio.delete(this.seleccionado.moviId).subscribe();

        this.actualizarTabla();

      }else{
        this.cancelar();
      }
    });

  }

  edit(seleccionado: Movil) {
    this.mostrarFormularioEditarMovil = true;
    this.seleccionado = seleccionado;

  }

  guardar() {

  }
  editarMovil(){
    this.editarMovilF = true;
  }

  cancelar() {
    this.mostrarFormularioAgregarMovil = false;
    this.mostrarFormularioMantenimiento = false;
    this.mostrarFormularioEditarMovil = false;
    this.editarMovilF = false;
  }

  actualizarMantenimiento(moviId: number) {

  }

}
