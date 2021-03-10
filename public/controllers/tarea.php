<?php
include_once "model/tarea.php";


$app->get('/tarea', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_VER");

    $db = SQL::connect();
    $model = new tarea();

    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });


$app->delete('/tarea/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQL::connect();
    $model = new Tarea();-

    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
    });

$app->put('/tarea', function ($request, $response, $args) {
        //$token = G::Autenticar($request, "ADMIN_MODIFICAR");
    
        $db = SQL::connect();
        $model = new Tarea();
    
        $results = $model->put($db);

        SQL::close($db);

        $payload = json_encode($results);
    
        $response->getBody()->write($payload);
        return $response
                  ->withHeader('Content-Type', 'application/json');
});

$app->post('/tarea', function ($request, $response, $args) {
    //$token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $db = SQL::connect();
    $model = new Tarea();

    $results = $model->post($db);

    SQL::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

?>