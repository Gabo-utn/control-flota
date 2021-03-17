import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service'

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number= 0;

  items : MovilBitacora[] = []
  itemBitacoraTarea: BitacoraTarea[] = [];

  seleccionado= new MovilBitacora();
  label = 'Agregar Nueva Bitacora'

  columnas : string[] = ['servNombre',
                        'mobiFecha',
                        'mobiObservaciones',
                        'mobiOdometro',
                        'acciones'];
  
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});

  mostrarFormulario = false;

  servicios: Servicio[] = [];
  BitacoraTareaService: any;



  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
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

    this.movilBitacoraService.get('mobiMoviId=${this.moviId}').subscribe(
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
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormulario = true;

  }

  delete(row: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.movilBitacoraService.delete(this.seleccionado.mobiId).subscribe(
            () => {
              this.items = this.items.filter(
                (item) => {
                  if (item.mobiId != this.seleccionado.mobiId) {
                    return true
                  } else {
                    return false
                  }
                });
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

  guardar() { if (!this.form.valid) {
    return;
  }

  if(this.seleccionado.mobiId) {
    this.seleccionado.mobiServId = this.form.value.mobiServId;
    this.seleccionado.mobiFecha = this.form.value.mobiFecha;
    this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
    this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

    //TODO actualizar valores de mobiProximoOdometro y mobiProximaFecha

    this.movilBitacoraService.put(this.seleccionado).subscribe();
    this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
    this.items.push(this.seleccionado);

  }else{
    
    this.seleccionado.mobiMoviId = this.moviId;
    this.seleccionado.mobiServId = this.form.value.mobiServId;
    this.seleccionado.mobiFecha = this.form.value.mobiFecha;
    this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
    this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
    // TODO  asignar this.seleccionado.mobiMoseId
    // TODO asignar this.seleccionado.mobiProximoOdometro
    // TODO asignar this.seleccionado.mobiProximaFecha
    // TODO asignar this.seleccionado.mobiIdAnterior
    // TODO asignar this.seleccionado.mobiIdSiguiente
    // TODO asignar this.seleccionado.mobiPendiente

    this.movilBitacoraService.post(this.seleccionado).subscribe();
    this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
    this.seleccionado.servNombre = this.items.find(x => x.mobiId = this.seleccionado.mobiId)!.servNombre;
    this.items.push(this.seleccionado);
  }

  this.form.reset();
  this.actualizarTabla();
}

  

  cancelar() {
    this.form.reset();
    this.label = 'Agregar Nueva Bitacora'
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


}
