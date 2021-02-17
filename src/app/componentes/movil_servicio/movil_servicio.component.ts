import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/confirmar/datos/datos.service';



@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil_servicio.component.html',
  styleUrls: ['./movil_servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() grupId: number = 0;


  movilservicios: MovilServicio[] = [];
  seleccionado = new MovilServicio();

  columnas: string[] = ['moseId',
    'moseMovildId',
    'moseId ',
    'moseSerld',
    'mosePeriodo',
    'moseFech',
    'moseKM',
    'acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux: number = -1;


  constructor(private MovilServicioService: MovilServicioService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moseId: [''],
      moseGrupId: [''],
      moseServId: ['', Validators.required],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseBorrado: [''],
      moseFechaAlta: [''],
      moseNombre: [''],

    });

    this.MovilServicioService.get(`moseGrupId=${this.grupId}`).subscribe(
      (MovilServicio) => {
        this.datosService.movser = MovilServicio;
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
    this.dataSource.data = this.datosService.mover.filter(borrado => borrado.moseBorrado==false);
  }

  agregar() {
    this.idAux--;
    this.seleccionado = new MovilServicio();
    this.seleccionado.movId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: MovilServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.movBorrado = true;
        this.actualizarTabla();
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

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.moseNombre = this.servicios.find(servicio => servicio.moseId == this.seleccionado.movmoseId)!.moseNombre;
    this.seleccionado.mosePeriodo = this.servicios.find(servicio  => servicio.moseId == this.seleccionado.movmoseId)!.mosePeriodo;
    this.seleccionado.moseKM = this.servicios.find(servicio  => servicio.moseId == this.seleccionado.movmoseId)!.moseKM;
    this.seleccionado.moseFecha = this.servicios.find(servicio  => servicio.moseId == this.seleccionado.movmoseId)!.moseFecha;

    if(this.seleccionado.moseId > 0){
      const elemento = this.moseservicios.find(mover => mover.movId == this.seleccionado.moseId);
      this.movilservicios.splice(this.seleccionado.movId, 1, elemento!);
    }else{
      this.datosService.mover.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
