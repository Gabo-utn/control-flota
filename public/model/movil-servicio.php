<?php
 
class MovilServicio {
    public $table = 'MovilServicio';
    public $fields = '   moseId
                        ,moseMoviId
                        ,moseServId
                        ,mosePeriodo
                        ,moseKM
                        ,moseFecha
                        ,CONVERT(VARCHAR, moseFechaAlta, 126) moseFechaAlta
                        ,moseBorrado
                        ,servNombre';
    public $join = "LEFT OUTER JOIN Servicio ON moseServId = servId";

    //----------------------------------GET

    public function get($db) {
        $sql = "SELECT $this->fields
                FROM $this->table
                $this->join
                WHERE moseBorrado = 0";
        $params = null;

        if(isset($_GET["moseMoviId"])){
            $params = [$_GET["moseMoviId"]];
            $sql = $sql . "AND moseMoviId = ?";
        }

        $stmt = SQL::query($db, $sql, $params);

        $results = [];

        while( $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    //----------------------------------DELETE

    public function delete($db, $id) {
        $sql =" UPDATE $this->table
                SET moseBorrado = 1
                WHERE moseId = ?";
        $params = [$id];

        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return [];

    }

    //----------------------------------POST

    public function post($db){
        $sql = "INSERT INTO $this->table
                (moseMoviId
                ,moseServId
                ,mosePeriodo
                ,moseKM
                ,moseFecha
                ,moseFechaAlta
                ,moseBorrado)
                VALUES (?,?,?,?,?,CONVERT(VARCHAR,GETDATE(),126),0);
                
                SELECT @@IDENTITY moseId, CONVERT(VARCHAR, GETDATE(),126) moseFechaAlta;";

        $params = [DATA["moseMoviId"]
                    ,DATA["moseServId"]
                    ,DATA["mosePeriodo"]
                    ,DATA["moseKM"]
                    ,DATA["moseFecha"]];
        
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);

        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["moseId"] = $row["moseId"];
        $results["moseFechaAlta"] = $row["moseFechaAlta"];
        $results["moseBorrado"] = 0;

        return $results;
    }

    //----------------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET moseServId = ?,
                    mosePeriodo = ?,
                    moseKM = ?,
                    moseFecha = ?
                WHERE moseId = ?";

        $params = [DATA["moseServId"]
                    ,DATA["mosePeriodo"]
                    ,DATA["moseKM"]
                    ,DATA["moseFecha"]
                    ,DATA["moseId"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return DATA;
    } 

}
?>