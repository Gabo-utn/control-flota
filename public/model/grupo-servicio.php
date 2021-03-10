<?php
class GrupoServicio
{
    public $table = 'GrupoServicio';
    public $fields = 'grusId
            ,grusGrupId
            ,grusServId
            ,grusPeriodo
            ,grusKM
            ,grusFecha
            ,CONVERT(VARCHAR, grusFechaAlta, 126) grusFechaAlta
            ,grusBorrado
            ,servNombre'; 

    public $join = " LEFT OUTER JOIN Servicio ON grusServId = servId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE grusBorrado = 0";

        $params = null;
        if (isset( $_GET["grusGrupId"])){
            $params = [$_GET["grusGrupId"]];
            $sql = $sql . " AND grusGrupId = ? ";
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
        "UPDATE $this->table SET grusBorrado = 1 - grusBorrado
        WHERE grusId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
            (grusGrupId
            ,grusServId
            ,grusPeriodo
            ,grusKM
            ,grusFecha
            ,grusFechaAlta
            ,grusBorrado)
        VALUES (?,?,?,?,?,GETDATE(),0);
        SELECT @@IDENTITY grusId, CONVERT(VARCHAR, GETDATE(), 126) grusFechaAlta;",
        [DATA["grusGrupId"]
        ,DATA["grusServId"]
        ,DATA["grusPeriodo"]
        ,DATA["grusKM"]
        ,DATA["grusFecha"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["grusId"] = $row["grusId"];
        $results["grusFechaAlta"] = $row["grusFechaAlta"];
        $results["grusBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET grusServId = ?
        WHERE grusId = ?",
        [
            DATA["grusGrupId"],
            DATA["grusId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }
}
?>