<?php
include_once 'model/bitacora-tarea.php';

//----------------------------------GET

$app->get("/bitacora-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new BitacoraTarea();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------DELETE

$app->delete("/bitacora-tarea/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new BitacoraTarea();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST

$app->post("/bitacora-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new BitacoraTarea();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------PUT

$app->put("/bitacora-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new BitacoraTarea();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});



?>