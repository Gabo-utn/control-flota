<?php
class MovilGrupo {
    public $table = 'MovilGrupo';
    public $fields = '  mogrId,
                        mogrMoviId,
                        mogrGrupId,
                        CONVERT(VARCHAR,mogrFechaAlta,126) mogrFechaAlta,
                        mogrBorrado';
    public $join = '';

    //------------------------------------GET

    public function get($db) {
        $sql = "SELECT $this->fields
                FROM $this->table
                WHERE mogrBorrado = 0";
        $params = null;
        if(isset($_GET["mogrMoviId"])){
            $params = [$GET["mogrMoviId"]];
            $sql = $sql . "AND mogrMoviId = ?";
        }

        $stmt = SQL::query($db,$sql,$params);

        $results = [];
        while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
            $results[] = $row;
        }

        return $results;
    }

    //------------------------------------DELETE

    public function delete($db, $id) {
        $sql = "UPDATE $this->table
                SET mogrBorrado = 1
                WHERE mogrId = ?";
        $params = [$id];
        $stmt = SQL::query($db,$sql,$params);
        sqlsrv_fetch($stmt);

        return 'done';
    }

    //------------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (mogrMoviId
                ,mogrGrupId
                ,mogrFechaAlta
                ,mogrBorrado) 
                VALUES(?,?,GETDATE(),0);
                
                SELECT @@IDENTITY mogrId, CONVERT(VARCHAR, GETDATE(),126) mogrFechaAlta;";

        $params = [DATA["mogrMoviId"],DATA["mogrGrupId"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["mogrId"] = $row["mogrId"];
        $results["mogrFechaAlta"] = $row["mogrFechaAlta"];
        $results["mogrBorrado"] = 0;
        

        return $results;
}

    //------------------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET mogrGrupId = ?
                WHERE mogrId = ?";
        $params = [DATA["mogrGrupId"],
                    DATA["mogrId"]];
        $stmt = SQL::query($db,$sql,$params);
        sqlsrv_fetch($stmt);

        return DATA;      
    }
}
?>