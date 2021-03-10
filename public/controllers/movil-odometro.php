<?php
include_once 'model/movil-odometro.php';

//-GET

$app->get("/movil-odometro",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilOdometro();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});
//-DELETE

$app->delete("/movil-odometro/{id}",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilOdometro();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//--POST

$app->post("/movil-odometro",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilOdometro();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//-PUT

$app->put("/movil-odometro",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilOdometro();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

?>