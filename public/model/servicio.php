<?php

class Servicio
{
    public $table = 'Servicio';
    public $fields = 'servId
                ,servNombre
                ,servDescripcion
                ,CONVERT(VARCHAR, servFechaAlta, 126) servFechaAlta
                ,servPeriodo
                ,servKM
                ,servFecha
                ,servBorrado'; 

    public $join = "";
    
    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE servBorrado = 0";

        $stmt = SQL::query($db, $sql, null);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET servBorrado = 1 - servBorrado
        WHERE servId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
        (servNombre
        ,servDescripcion
        ,servPeriodo
        ,servKM
        ,servFecha
        ,servFechaAlta
        ,servBorrado')
        VALUES (?,?,GETDATE(),0);

        SELECT @@IDENTITY servId, CONVERT(VARCHAR, GETDATE(), 126) servFechaAlta;",
        [DATA["servNombre"],
         DATA["servDescripcion"],
         DATA["servPeriodo"],
         DATA["servKM"],
         DATA["servFecha"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["servId"] = $row["servId"];
        $results["servFechaAlta"] = $row["servFechaAlta"];
        $results["servDescripcion"] = $row["sservDescripcion"];
        $results["servPeriodo"] = $row["servPeriodo"];
        $results["servKM"] = $row["servKM"];
        $results["servFecha"] = $row["servFecha"];
        $results["servBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET servNombre = ?
            ,servDescripcion = ?
            ,servPeriodo = ?
            ,servKM = ?
            ,servFecha = ?
        WHERE servId = ?",
        [
            DATA["servNombre"],
            DATA["servDescripcion"],
            DATA["servPeriodo"],
            DATA["servKM"],
            DATA["servFecha"],
            DATA["servId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>