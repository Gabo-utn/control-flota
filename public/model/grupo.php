<?php

class Grupo
{
    public $table = 'Grupo';
    public $fields = 'grupId
                ,grupNombre
                ,grupDescripcion
                ,CONVERT(VARCHAR, grupFechaAlta, 126) grupFechaAlta
                ,grupBorrado'; 

    public $join = "";
    
    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE grupBorrado = 0";

        $stmt = SQL::query($db, $sql, null);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET grupBorrado = 1 - grupBorrado
        WHERE grupId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
        (grupNombre
        ,grupDescripcion
        ,grupFechaAlta
        ,grupBorrado)
        VALUES (?,?,GETDATE(),0);

        SELECT @@IDENTITY grupId, CONVERT(VARCHAR, GETDATE(), 126) grupFechaAlta;",
        [DATA["grupNombre"], DATA["grupDescripcion"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["grupId"] = $row["grupId"];
        $results["grupFechaAlta"] = $row["grupFechaAlta"];
        $results["grupBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET grupNombre = ?
            ,grupDescripcion = ?
        WHERE grupId = ?",
        [
            DATA["grupNombre"],
            DATA["grupDescripcion"],
            DATA["grupId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>