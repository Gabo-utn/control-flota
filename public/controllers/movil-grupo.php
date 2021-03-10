<?php
include_once 'model/movil-grupo.php';

//---------------------------------------GET

$app->get("/movil-grupo",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilGrupo();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------------DELETE

$app->delete("/movil-grupo/{id}",function ($request, $response, $args){
    $id = $args["id"];
    $db = SQL::connect();
    $model = new MovilGrupo();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------------POST

$app->post("/movil-grupo",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilGrupo();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});


//---------------------------------------PUT

$app->put("/movil-grupo",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new MovilGrupo();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

?>