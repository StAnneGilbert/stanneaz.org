<?php

/**
 * Craft web bootstrap file
 */
 
// Project root path
$root = dirname(__DIR__);

define('CRAFT_SITE', 'en_us');

// Load Composer's autoloader
require_once $root.'/vendor/autoload.php';

// Load dotenv?
if (file_exists($root.'/.env')) {
    $dotenv = new Dotenv\Dotenv($root);
    $dotenv->load();
}

// Craft
define('CRAFT_BASE_PATH', $root);
$app = require CRAFT_BASE_PATH.'/vendor/craftcms/cms/bootstrap/web.php';
$app->run();
