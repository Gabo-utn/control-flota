import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';

import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service'

import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';

import { ServicioTarea } from '../../modelo/servicio-tarea';
import { ServicioTareaService } from '../../servicios/servicio-tarea.service';

import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service';
import { AvisoComponent } from 'src/app/shared/aviso/aviso/aviso.component';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number= 0;
  @Input() servId: number = 0;

  @Input() desdeMS: boolean = false;

  @Input() moseId: number = 0;
  

  items : MovilBitacora[] = []
  itemBitacoraTarea: BitacoraTarea[] = [];

  seleccionado= new MovilBitacora();
  

  columnas : string[] = ['servNombre',
                        'mobiFecha',
                        'mobiObservaciones',
                        'mobiOdometro',
                        'acciones'];
  
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});
  formTarea = new FormGroup({});
  mostrarFormularioAgregarBitacora = false;
  bitacoraTarea: BitacoraTarea[] = [];


  mostrarFormulario = false;

  servicios: Servicio[] = [];
  BitacoraTareaService: any;

  movilServicios: MovilServicio[] = [];
  servicioTarea: ServicioTarea[] = [];
 
  label = 'Agregar Nueva Bitacora';
  desdeGBitacora = false;
  disbledATP = false;
  tareas: Tarea[]=[];
  agregarTareasPreestablecidas = false;
  bitaTarea = new BitacoraTarea();

  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
    private movilServicioService: MovilServicioService,
    private servicioTareaService: ServicioTareaService,
    private tareaService: TareaService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mobiId: [''],
      mobiMoseId: [''],
      mobiServId: [''],
      mobiMoviId: [''],
      mobiFecha: [''],
      mobiObservaciones: [''],
      mobiOdometro: [''],
      mobiProximoOdometro: [''],
      mobiProximaFecha: [''],
      mobiIdAnterior: [''],
      mobiIdSiguiente: [''],
      mobiPendiente: [''],
      mobiFechaAlta: [''],
      mobiBorrado: [''],

      servNombre: ['']
    });

    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      }
    );
    this.movilServicioService.get().subscribe(
      (movil) => {
        this.movilServicios = movil;
      }
    )
    this.bitacoraTareaService.get().subscribe(
      (bitare) => {
        this.bitacoraTarea = bitare;
      }
    )
    this.servicioTareaService.get().subscribe(
      (tarea) => {
        this.servicioTarea = tarea;
      }
    )
    this.tareaService.get().subscribe(
      (tareas) => {
        this.tareas = tareas;
      }
    )
    if(this.desdeMS){
      this.mostrarFormularioAgregarBitacora = true;
      this.form.get('mobiServId')?.setValue(this.servId);
      this.label = 'Agregar Bitacora';
    }
    

    
 
  }
  

  actualizarTabla() {
    this.dataSource.data = this.items;
    //this.dataSource.paginator = this.paginator;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  agregarNuevaBitacora() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormularioAgregarBitacora = true;
    this.disbledATP = true;
    this.label = 'Agregar nueva Bitacora'; 
  }

  

  delete(row: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.movilBitacoraService.delete(this.seleccionado.mobiId).subscribe(
            () => {
              this.items = this.items.filter(x => x.mobiId !== this.seleccionado.mobiId);
              this.actualizarTabla();
            
                
            });
        }
      });

  }

  edit(seleccionado: MovilBitacora) {
    this.label ="Editar Bitacora"
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }
  realizarServicio(seleccionado: MovilBitacora){
    this.mostrarFormularioAgregarBitacora = true;
    this.agregarTareasPreestablecidas = true;
    this.label = 'Agregar Bitacora Pendiente';
    this.disbledATP= false;
    this.desdeGBitacora = true;
    this.seleccionado = seleccionado;
    this.form.reset();
    this.form.get('mobiServId')!.setValue(this.seleccionado.mobiServId);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    let moseKM = 0;
    let mosePeriodo =0;

    //desde grilla movil-servicio (nuevo servicio programado)

    if(this.desdeMS){

      alert("Bitacora agregada desde movil servicio. Servicio Programado.")
      this.seleccionado.mobiMoviId = this.moviId;
      this.seleccionado.mobiServId = this.servId;
      this.seleccionado.mobiMoseId = this.moseId;
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      
      
      
      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      mosePeriodo = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.mosePeriodo;
      
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      this.seleccionado.mobiPendiente = true;
      this.movilBitacoraService.post(this.seleccionado).subscribe();    
      
      
     
    

     

      this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
      this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);
      this.items.push(this.seleccionado);

      if(this.agregarTareasPreestablecidas){
        this.tareasPreestablecidad(this.seleccionado);
      }

      this.desdeMS = false;


      //nueva bitacora desde grilla de bitacora (servicio pendiente)

    } else if (this.desdeGBitacora){ //+ bitacora desde la grilla de B

      alert("Servicio agregado desde Grilla Bitacora. Servicio Pendiente.")
      
     

      //cargar bitacora siguiente

      
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      mosePeriodo = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.mosePeriodo

     
      this.seleccionado.mobiProximaFecha = this.seleccionado.mobiFecha;
      this.seleccionado.mobiProximaFecha.setDate(this.seleccionado.mobiProximaFecha.getDate() + mosePeriodo);
      
      this.seleccionado.mobiProximaFecha;

      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado;
      //debugger
      //debugger

      //mobiProximafecha un bardo calcular
      this.seleccionado.mobiPendiente = true;
      this.seleccionado.mobiIdAnterior = this.seleccionado.mobiId;
      //mobIdSiguiente null

      this.movilBitacoraService.post(this.seleccionado).subscribe();

      this.items = this.items.filter(x => x.mobiId !== this.seleccionado.mobiId);
      this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);

      //agregar tareas preestablecidas
     if(this.agregarTareasPreestablecidas){
        this.tareasPreestablecidad(this.seleccionado);
      }



      this.desdeGBitacora = false;


      
    } else if(this.seleccionado.mobiId) {
        alert("Editar Servicio")
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

        moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
        this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      
        //TODO actualizar valor mobiProximaFecha

        this.movilBitacoraService.put(this.seleccionado).subscribe();
        this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
        this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
        this.items.push(this.seleccionado);

       }else{

        alert("Servicio agregado desde pantalla Bitacora. Servicio No Programado.")
        this.seleccionado.mobiMoviId = this.moviId;
        // this.seleccionado.mobiMoseId null pues es un servicio no programado
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
        
        
        
        this.movilBitacoraService.post(this.seleccionado).subscribe();
        this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
        this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
        this.items.push(this.seleccionado);
      }
      this.mostrarFormularioAgregarBitacora = false;
      this.actualizarTabla();
    }

  

  cancelar() {
    this.actualizarTabla();
    this.label = 'Agregar Nueva Bitacora';
    this.mostrarFormulario = false;
    this.form.reset();
  }

  actualizarDetalle(mobiId: number){
    this.itemBitacoraTarea.forEach((i) => {
      i.bitaMobiId = mobiId;

      if(i.bitaBorrado) {
        this.BitacoraTareaService.delete(i.bitaId).subscribe();
      }

      if (i.bitaId < 0) {
        this.BitacoraTareaService.post(i).subscribe();
      }

      if (i.bitaId > 0) {
        this.BitacoraTareaService.put(i).subscribe();        
      }
    });

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }
  agregarTareasPreestablecidass(){
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.agregarTareasPreestablecidas = true;

          this.matDialog.open(AvisoComponent);

        }
      });
  }
  tareasPreestablecidad(seleccionado: MovilBitacora){

    this.movilBitacoraService.get().subscribe(
      (bita) => {
        this.items = bita;
      }
    )

    //traigo las tareas correspondientes al servicio mobiServId
    this.servicioTarea = this.servicioTarea.filter(x => x.setaServId == seleccionado.mobiServId);
    
    //por cada tarea de servicioTarea
    this.servicioTarea.forEach((i) => {

      //agregamos una bitacora tarea por cada tarea
      
      this.bitaTarea.bitaTareId = i.setaTareId;
      this.bitaTarea.bitaObservaciones = '';//this.tareas.find(x => x.tareId = i.setaTareId)!.tareDescripcion;
      this.bitaTarea.bitaMobiId = this.items.find(x => x.mobiBorrado == 0)!.mobiId;;
      //debugger
      this.bitaTarea.bitaCosto = this.tareas.find(x => x.tareId = i.setaTareId)!.tareCosto;
      this.bitaTarea.bitaCantidad = this.tareas.find(x => x.tareId = i.setaTareId)!.tareCantidad;
    
      this.bitacoraTareaService.post(this.bitaTarea).subscribe();
      this.bitacoraTarea.filter(x => x.bitaId !== this.bitaTarea.bitaId);
      this.bitaTarea.tareNombre = this.tareas.find(x => x.tareId = i.setaTareId)!.tareNombre;
      this.bitacoraTarea.push(this.bitaTarea);

    })

  }


}
