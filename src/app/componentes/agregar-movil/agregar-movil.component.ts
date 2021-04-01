import { Component,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { AvisoComponent} from 'src/app/shared/aviso/aviso/aviso.component';
import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { Movil } from '../../modelo/movil';
import { MovilService } from '../../servicios/movil.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-agregar-movil',
  templateUrl: './agregar-movil.component.html',
  styleUrls: ['./agregar-movil.component.css']
})
export class AgregarMovilComponent implements OnInit {

  items : Movil[] = [];
  seleccionado = new Movil();


  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones','estado'];
  dataSource = new MatTableDataSource<Movil>();

  
  formGrupo = new FormGroup({});

  // son los modelos
  moviles: Movil[] = [];

  mostrarFormularioAgregar = false;

  patente : string = '';
  descripcion : string = '';
  dependencia : string = '';

  
  
  
  
  constructor(
    private movilServicio: MovilService,
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
    this.formGrupo = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: ['']
    })

  }

    actualizarTabla() {
      this.dataSource.data = this.items;
      this.dataSource.paginator = this.paginator;
    }

    agregar(seleccionado:Movil) {

      const dialogRef = this.matDialog.open(ConfirmarComponent);
  
      dialogRef.afterClosed().subscribe(
        result => {
  
        console.log(`Dialog result: ${result}`);
  
        if (result) {
  
          //agregar movil
  
          this.mostrarFormularioAgregar = true;
  
          this.seleccionado = seleccionado;
          this.seleccionado.moviId = this.seleccionado.moviId
  
          this.movilServicio.post(this.seleccionado).subscribe();
  
          //dialogo exito
  
          const dialogRefe = this.matDialog.open(AvisoComponent);
  
          dialogRefe.afterClosed().subscribe(
            result => {
              console.log(`Dialog result: ${result}`)
            }
          )
  
        }else{
          this.cancelar();
        }
      });
      
    }
    reactivar(seleccionado: Movil) {
      const dialogRef = this.matDialog.open(ConfirmarComponent);
  
      dialogRef.afterClosed().subscribe(
        result => {
  
        console.log(`Dialog result: ${result}`);
  
        if (result) {
  
          this.seleccionado = seleccionado;
          this.seleccionado.moviBorrado = 0;
  
          this.movilServicio.put(this.seleccionado).subscribe();
  
          const dialogRefe = this.matDialog.open(AvisoComponent);
  
          dialogRefe.afterClosed().subscribe(
            result => {
              console.log(`Dialog result: ${result}`)
            }
          )
  
        }else{
          this.cancelar();
        }
      });
    }
    buscar(){

      if(!this.patente && !this.descripcion && !this.dependencia){
        alert("Busque por algun filtro")
      }
      if(this.patente && !this.descripcion && !this.dependencia){
        this.movilServicio.get(`?patente=${this.patente}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      } else if(this.descripcion && !this.patente && !this.dependencia){
        this.movilServicio.get(`descripcion=${this.descripcion}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      } else if(this.dependencia && !this.patente && !this.descripcion ){
        this.movilServicio.get(`dependencia=${this.dependencia}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      }
  
      if(this.patente && this.descripcion){
      } else if (this.patente && this.dependencia){
        this.movilServicio.get(`patente=${this.patente}&dependencia=${this.dependencia}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      } else if(this.descripcion && this.dependencia){
        this.movilServicio.get(`descripcion=${this.descripcion}&dependencia=${this.dependencia}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      } else if(this.patente && this.descripcion && this.dependencia){
        this.movilServicio.get(`patente=${this.patente}&descripcion=${this.descripcion}&dependencia=${this.dependencia}&activo=0`).subscribe(
          (moviles) => {
            this.items = moviles;
            this.actualizarTabla();
          }
        )
      }
    }
  
    cancelar() {
      this.mostrarFormularioAgregar = false;
    }
  
  
  }


