import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { Tarea } from './../../modelo/tarea';
import { TareaService } from 'src/app/servicios/tarea.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar//confirmar.component';
;

@Component({
  selector: 'app-grupo',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {
  items: Tarea[] = [];
  seleccionado = new Tarea();

  columnas: string[] = ['tareNombre',
                        'tareDescripcion',
                        'tareUnidadMedida',
                        'tareCantidad',
                         'tareCosto',
                         'acciones'];
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource= new MatTableDataSource<Tarea>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) tabla: MatTable<Tarea> | undefined;

  constructor(private tareaService: TareaService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }




  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {


      this.form = this.formBuilder.group({
        tareId: [''],
        tareNombre: ['',Validators.required],
        tareDescripcion: ['',Validators.required],
        tareUnidadMedida: ['',Validators.required],
        tareCantidad: ['',Validators.required],
        tareFechaAlta: [''],
        tareBorrado: [''],
        tareCosto: ['']
    });
    this.tareaService.get().subscribe(
      (Tarea) => {
        this.items = Tarea;
        this.actualizarTabla();
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new Tarea();
    this.mostrarFormulario = true;
  }
  edit(seleccionado: Tarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    // si el formulario es diferente asignar uno por uno...
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;


    if (this.seleccionado.tareId) {
      this.tareaService.put(this.seleccionado)
        .subscribe((Tarea) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.tareaService.post(this.seleccionado)
        .subscribe((Tarea) => {
          this.items.push(Tarea);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }
  delete(row: Tarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.tareaService.delete(row.tareId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.tareId != row.tareId) {
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





}
