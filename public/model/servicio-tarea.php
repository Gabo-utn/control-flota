<?php

class ServicioTarea
{
    public $table = 'ServicioTarea';
    public $fields = 'setaId
            ,setaServId
            ,setaTareId
            ,CONVERT(VARCHAR, setaFechaAlta, 126) setaFechaAlta
            ,setaBorrado
            ,tareNombre'; 

    public $join = " LEFT OUTER JOIN Tarea ON setaTareId = tareId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE setaBorrado = 0";

        $params = null;
        if (isset( $_GET["setaServId"])){
            $params = [$_GET["setaServId"]];
            $sql = $sql . " AND setaServId = ? ";
        };
        

        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET setaBorrado = 1 - setaBorrado
        WHERE setaId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
            (setaServId
            ,setaTareId
            ,setaFechaAlta
            ,setaBorrado)
        VALUES (?,?,GETDATE(),0);
        SELECT @@IDENTITY setaId, CONVERT(VARCHAR, GETDATE(), 126) setaFechaAlta;",
        [ DATA["setaServId"]
        ,DATA["setaTareId"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["setaId"] = $row["setaId"];
        $results["setaFechaAlta"] = $row["setaFechaAlta"];
        $results["setaBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET setaTareId = ?
        WHERE setaId = ?",
        [
            DATA["setaServId"],
            DATA["setaId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>