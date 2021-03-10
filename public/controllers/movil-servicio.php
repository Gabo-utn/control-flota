<?php
include_once 'model/movil-servicio.php';

//----------------------------------GET

$app->get("/movil-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilServicio();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------DELETE

$app->delete("/movil-servicio/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new MovilServicio();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST

$app->post("/movil-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilServicio();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST

$app->put("/movil-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilServicio();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

?>