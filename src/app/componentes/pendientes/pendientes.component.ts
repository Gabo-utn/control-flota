import { Component,OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { MovilBitacora } from '../../modelo/movil-bitacora';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.css']
})
export class PendientesComponent implements OnInit {

  items: MovilBitacora[] = [];

  seleccionado = new MovilBitacora();

  columnas: string[] = ['patente','descripcion','servicio','mobiProximoOdometro','mobiProximaFecha','estado','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  fechaActual = new Date();

  constructor(
    private mmovilBitacoraService: MovilBitacoraService,
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {

    this.mmovilBitacoraService.get(`mobiPendiente=1`).subscribe(
      (mobi) => {
        this.items = mobi;
        this.actualizarTabla();
      }
    )
    
  }

  actualizarTabla(){
    this.dataSource.data = this.items;
  }
  

  edit(serv: MovilBitacora){

  }

  delete(serv: MovilBitacora){

  }

  realizarServicio(serv: MovilBitacora){

  }


}