import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Tarea } from './../../modelo/tarea';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TareaService } from 'src/app/servicios/tarea.service';
;

@Component({
  selector: 'app-grupo',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {
  items: Tarea[] = [];
  seleccionado = new Tarea();
  columnas: string[] = ['tareId','tareNombre','tareDescripcion','tareUnidadMedida','tareCantidad', 'tareCosto','acciones'];
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
      tareDescripcion: ['', Validators.required],

      tareNombre:[],
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




}
