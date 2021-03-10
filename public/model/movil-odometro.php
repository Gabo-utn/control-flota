<?php
class MovilOdometro {
    public $table = 'MovilOdometro';
    public $fields = 'modoId,
                        modoMoviId,
                        CONVERT(VARCHAR,modoFecha,126) modoFecha,
                        modoOdometro,
                        CONVERT(VARCHAR,modoFecha,126) modoFechaAlta,
                        modoBorrado';
    
    //---GET
    
    public function get($db) {
        $sql = "SELECT $this->fields
                FROM $this->table
                WHERE modoBorrado = 0";
        $params = null;
        if(isset($_GET["modoMoviId"])){
            $params = [$_GET["modoMoviId"]];
            $sql = $sql . "AND modoMoviId = ?";
        }

        $stmt = SQL::query($db,$sql,$params);

        $results = [];

        while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
            $results[] = $row;
        }

        return $results;
    }

    //--DELETE

    public function delete($db,$id) {
        $sql = "UPDATE $this->table
                SET modoBorrado = 0
                WHERE modoId = ?";
        $params = [$id];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return [];
        
    }
    //---------------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (modoMoviId,
                modoFecha,
                modoOdometro,
                modoFechaAlta,
                modoBorrado)
                
                VALUES (?,?,?,GETDATE(),0);
                
                SELECT @@IDENTITY modoId, CONVERT(VARCHAR, GETDATE(),126) modoFechaAlta;";

        $params = [DATA["modoMoviId"],DATA["modoFecha"],DATA["modoOdometro"]];

        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);

        $row=(sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC));

        $results = DATA;
        $results["modoId"] = $row["modoId"];
        $results["modoFechaAlta"] = $row["modoFechaAlta"];
        $results["modoBorrado"] = 0;

        return $results;
    }

    //---------------------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET modoFecha = ?,
                    modoOdometro = ?
                WHERE modoId = ?";
        $params = [DATA["modoFecha"],
                    DATA["modoOdometro"],
                    DATA["modoId"]];
        $stmt = SQL::query($db,$sql,$params);
        sqlsrv_fetch($stmt);

        return DATA;      
    }

}
?> 