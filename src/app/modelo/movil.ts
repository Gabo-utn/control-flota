export class Movil{
moviId:number= 0;//relacion 1:1 con AVL_Estructura.dbo.Movil
moviModoFecha:Date = new Date();      //copia del ultimo odometro;
moviModoOdometro:Date = new Date();
servFechaAlta: Date = new Date();
servBorrado = false;
moviBorrado: number = 0;
patente: string = '';
descripcion:string = '';
dependencia: string = '';
dependenciaCompleta: string = '';
marca: string = '';
modelo: string = '';
anio: number = 0;
chasis: number = 0;
tipoMovil: string = '';
color: string = '';
seguro: string = '';
poliza: string = '';
numeroMotor: number = 0;
peso: number = 0;
tienePatrullaje: boolean = false;
CUIT: number = 0;
}
