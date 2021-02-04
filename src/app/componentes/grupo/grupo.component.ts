import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Grupo } from './../../modelo/grupo';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar//confirmar.component';
;
;

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  items: Grupo[] = [];
  seleccionado = new Grupo();
  columnas: string[] = ['grupId', 'grupNombre', 'grupDescripcion', 'acciones'];
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource= new MatTableDataSource<Grupo>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) tabla: MatTable<Grupo> | undefined;

  constructor(private grupoService: GrupoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }




  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grupId: [''],
      grupDescripcion: ['', Validators.required],
      grupNombre:[],
    });
    this.grupoService.get().subscribe(
      (Grupo) => {
        this.items = Grupo;
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
    this.seleccionado = new Grupo();
    this.mostrarFormulario = true;
  }

  delete(row: Grupo) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.grupoService.delete(row.grupId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.grupId != row.grupId) {
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

  edit(seleccionado: Grupo) {
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


    if (this.seleccionado.grupId) {
      this.grupoService.put(this.seleccionado)
        .subscribe((Grupo) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.grupoService.post(this.seleccionado)
        .subscribe((Grupo) => {
          this.items.push(Grupo);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }





}
