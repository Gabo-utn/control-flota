<?php
class BitacoraTarea {
    public $table = 'BitacoraTarea';
    public $fields = 'bitaId,
                    bitaMobiId,
                    bitaTareId,
                    bitaObservaciones,
                    bitaCantidad,
                    bitaCosto,
                    CONVERT(VARCHAR,bitaFechaAlta,126) bitaFechaAlta,
                    bitaBorrado,
                    
                    tareNombre';
    public $join = "LEFT OUTER JOIN Tarea ON bitaTareId = tareId";

    //-------------------------------------GET
    public function get($db){
        $sql = "SELECT $this->fields
                FROM $this->table
                $this->join
                WHERE bitaBorrado = 0";
        $params = null;
        if(isset($_GET['bitaId'])){
            $params = [$_GET['bitaTareId']];
            $sql = $sql . "AND bitaTareId = ?";
        }
        $stmt = SQL::query($db, $sql, $params);

        $results = [];

        while ($row = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC)){
            $results[] = $row;
        }

        return $results;
    }
    //-------------------------------------DELETE

    public function delete ($db, $id) {
        $sql = "UPDATE $this->table
                SET bitaBorrado = 1
                WHERE bitaId = ?";
        $params = [$id];
        $stmt = SQL::query($db,$sql, $params);
        sqlsrv_fetch($stmt);

        return [];
    }
    //-------------------------------------POST

    public function post ($db) {
        $sql = "INSERT INTO $this->table
            (bitaMobiId,
            bitaTareId,
            bitaObservaciones,
            bitaCantidad,
            bitaCosto,
            bitaFechaAlta,
            bitaBorrado)
            VALUES (?,?,?,?,?,GETDATE(),0);
            
            SELECT @@IDENTITY bitaId, CONVERT(VARCHAR,GETDATE(),126) bitaFechaAlta;";
        $params = [DATA["bitaMobiId"],
                    DATA["bitaTareId"],
                    DATA["bitaObservaciones"],
                    DATA["bitaCantidad"],
                    DATA["bitaCosto"]];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);

        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        $results = DATA;
        $results['bitaId'] = $row['bitaId'];
        $results['bitaFechaAlta'] = $row['bitaFechaAlta'];
        $results['bitaBorrado'] = 0;

        return $results;


    }
    //-------------------------------------PUT  

    public function put($db){
        $sql = "UPDATE $this->table
                SET bitaTareId = ?,
                    bitaObservaciones = ?,
                    bitaCantidad = ?,
                    bitaCosto = ?
                WHERE bitaId = ?";
        $params = [DATA["bitaTareId"],
                    DATA["bitaObservaciones"],
                    DATA["bitaCantidad"],
                    DATA["bitaCosto"],
                    DATA["bitaId"],];
        $stmt = SQL::query($db, $sql, $params);
        sqlsrv_fetch($stmt);

        return DATA;
    } 
}
?>