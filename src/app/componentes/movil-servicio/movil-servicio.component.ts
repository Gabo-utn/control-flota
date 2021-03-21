import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';

import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';

import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil-servicio.component.html',
  styleUrls: ['./movil-servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() moviId: number = 0;
  
  
  items : MovilServicio[] = [];


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
  

  formularioAgregarBitacora = false;
  
  
  servicio: Servicio[] = [];
  


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

    this.MovilServicioService.get(`moseMoviId=${this.moviId}`).subscribe(
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
    this.dataSource.paginator = this.paginator;
  }
 
  agregar() {
    this.form.reset();
    this.idAux--;
    this.seleccionado = new MovilServicio();
    

    

    this.mostrarFormulario = true;
  }

  delete(seleccionado: MovilServicio) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.MovilServicioService.delete(seleccionado.moseId).subscribe(
          () => {
            this.items = this.items.filter(x => x.moseId !== seleccionado.moseId);
            this.actualizarTabla();
          });
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

    if(this.seleccionado.moseId){
      this.seleccionado.moseServId = this.form.value.moseServId;

      this.MovilServicioService.put(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.moseId != this.seleccionado.moseId);
      this.items.push(this.seleccionado);
    }else{
      this.seleccionado.moseMoviId = this.moviId;
      this.seleccionado.moseServId = this.form.value.moseServId;
      this.seleccionado.mosePeriodo = this.servicios.find( x => x.servId == this.seleccionado.moseServId)!.servPeriodo;
      this.seleccionado.moseKM = this.servicios.find(x => x.servId == this.seleccionado.moseServId)!.servKM;
      this.seleccionado.servNombre =this.servicios.find(x => x.servId == this.seleccionado.moseServId)!.servNombre;      
      this.MovilServicioService.post(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.moseId != this.seleccionado.moseId);
      this.items.push(this.seleccionado);
    }

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }
  agregarBitacora(serv : MovilServicio){
    this.formularioAgregarBitacora = true;
    this.seleccionado = serv;
  }
  cancelar() {
    this.mostrarFormulario = false;
    this.formularioAgregarBitacora = false;
  }


}
