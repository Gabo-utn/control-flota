<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

date_default_timezone_set('America/Argentina/Buenos_Aires');

cors();
noCache();

ini_set('mssql.charset', 'UTF-8');
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 600);
ini_set('max_execution_time', 0);

$input = file_get_contents("php://input");
define('DATA', json_decode($input, true));


use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();


// Parse json, form data and xml
//$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();
$middleware = $app->addErrorMiddleware(true,true,true);
$errorHandler = $middleware->getDefaultErrorHandler();
$errorHandler->forceContentType('application/json');
$app->setBasePath($_SERVER['SCRIPT_NAME']);


include_once "config.php";
include_once "sql_srv.php";
include_once "globales.php";


/************* API *************/

include_once 'controllers/grupo.php';
include_once 'controllers/servicio.php';
include_once 'controllers/tarea.php';
include_once 'controllers/servicio-tarea.php';
include_once 'controllers/grupo-servicio.php';
include_once 'controllers/movil.php';
include_once 'controllers/movil-servicio.php';
include_once 'controllers/movil-grupo.php';
include_once 'controllers/movil-odometro.php';
include_once 'controllers/movil-bitacora.php';


$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("API");
    return $response;
});

$app->get('', function (Request $request, Response $response, $args) {
    $response->getBody()->write("API");
    return $response;
});

$app->get('/routes', function ($request, $response, $args) {
    // slim V4
    global $app;
    $routes = $app->getRouteCollector() ->getRoutes();// ->getAllRoutes();
    $link = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=="off") ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $link =str_replace("/routes", "", $link);
    echo '<pre>';
    foreach ($routes as $route) {
        echo '   ['.implode(', ', $route->getMethods())."]\t".$link.$route->getPattern()   , "<br>";
    }
    echo '</pre>';
    return $response;
});

$app->run();





function cors() {

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: *");
        //header("Access-Control-Allow-Origin: http://localhost:8080");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT, DELETE");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

function noCache() {
    header('Expires: Tue, 01 Jul 2001 06:00:00 GMT');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    }