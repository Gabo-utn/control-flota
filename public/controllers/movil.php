<?php
include_once 'model/movil.php';

//---GET

$app->get("/movil",function($request,$response,$args) {
    $db = SQL::connect();
    $model = new Movil();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---DELETE

$app->delete("/movil/{id}",function($request,$response,$args) {
    $id = $args['id'];
    $db = SQL::connect();
    $model = new Movil();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//-----POST

$app->post("/movil",function($request,$response,$args){
    $db = SQL::connect();
    $model = new Movil();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//-PUT

$app->put("/movil",function($request,$response,$args) {
    $db = SQL::connect();
    $model = new Movil();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});
?>