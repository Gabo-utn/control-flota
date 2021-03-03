import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { Servicio } from './../../modelo/servicio';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar//confirmar.component';
import { GlobalService } from '../../servicios/global.service';
import { ServicioTareaService } from 'src/app/servicios/servicio-tarea.service';



@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit,AfterViewInit {

  servicios: Servicio[] = [];
  seleccionado = new Servicio();

  columnas: string[] = ['servNombre',
                        'servDescripcion',
                        'servPeriodo',
                        'servKM',
                        'servFecha',
                        'acciones'];
  form = new FormGroup({});

  mostrarFormulario = false;
  dataSource= new MatTableDataSource<Servicio>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) tabla: MatTable<Servicio> | undefined;

  constructor(
    private servicioService:ServicioService,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    public stService : ServicioTareaService,
    public dialog: MatDialog) { }




  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  actualizar(){
    this.dataSource.data = this.servicios;
    this.dataSource.sort = this.sort;
   }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      servId: [''],
      servNombre: ['', Validators.required],
      servDescripcion: ['', Validators.required],
      servPeriodo: ['', Validators.required],
      servKM: ['', Validators.required],
      servFecha: ['', Validators.required],
      servFechaAlta: [''],
      servBorrado: ['']
    });


    this.servicioService.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
        this.actualizar();
      })
  }


  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

     mostrarServicio():Boolean{
      if(this.seleccionado.servId){
        return this.mostrarFormulario = true;
      }else{
        return this.mostrarFormulario = false;
      }
    }


   actualizarST(id : number){
    this.globalService.items.forEach( (dato) => { dato.setaServId = id;
        if(dato.setaBorrado){
          this.stService.delete(dato.setaId).subscribe();

        }else if(dato.setaId < 0){
          this.stService.post(dato).subscribe();

        }else (dato.setaId > 0 )
        this.stService.put(dato).subscribe();
        }
       );
      this.actualizar();
      this.mostrarFormulario = false
      }





    agregar() {
      this.form.reset();
      this.seleccionado = new Servicio();
      this.mostrarFormulario = true;
    }
    edit(seleccionado: Servicio) {
      this.mostrarFormulario = true;
      this.seleccionado = seleccionado;
      this.form.setValue(seleccionado);
    }

    guardar() {
      if (!this.form.valid) {
        return;
      }

    Object.assign(this.seleccionado,this.form.value);

    // si el formulario es diferente asignar uno por uno...
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;


    if (this.seleccionado.servId) {
      this.servicioService.put(this.seleccionado)
        .subscribe((servicio: Servicio) => {
          this.actualizarST(servicio.servId);

        });

    } else {
      this.servicioService.post(this.seleccionado)
        .subscribe((servicio: Servicio) => {
          this.servicios.push(servicio);
          this.actualizarST(servicio.servId);

        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }
  delete(row: Servicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.servicioService.delete(row.servId)
          .subscribe(() => {

            this.servicios = this.servicios.filter( x => x !== row);

            this.actualizar();
          });
      }
    });
  }





}
