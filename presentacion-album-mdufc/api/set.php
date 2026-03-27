<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(array('ok' => false, 'error' => 'method_not_allowed'));
	exit;
}

$root = dirname(__DIR__);
$configPath = $root . '/includes/config.php';

if (!is_readable($configPath)) {
	http_response_code(503);
	echo json_encode(array('ok' => false, 'error' => 'config_missing'));
	exit;
}

require $configPath;

if (!defined('OPERATOR_SECRET') || OPERATOR_SECRET === '' || OPERATOR_SECRET === 'reemplazar-por-secreto-largo-y-unico') {
	http_response_code(503);
	echo json_encode(array('ok' => false, 'error' => 'config_invalid'));
	exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
	$input = $_POST;
}

$secret = isset($input['secret']) ? (string) $input['secret'] : '';
$action = isset($input['action']) ? (string) $input['action'] : '';

if (!hash_equals(OPERATOR_SECRET, $secret)) {
	http_response_code(403);
	echo json_encode(array('ok' => false, 'error' => 'forbidden'));
	exit;
}

$setlistPath = $root . '/data/setlist.json';
if (!is_readable($setlistPath)) {
	http_response_code(500);
	echo json_encode(array('ok' => false, 'error' => 'setlist_missing'));
	exit;
}

$setlist = json_decode(file_get_contents($setlistPath), true);
$songs = isset($setlist['songs']) && is_array($setlist['songs']) ? $setlist['songs'] : array();
$max = max(0, count($songs) - 1);

$statePath = $root . '/data/state.json';
$state = array('currentIndex' => 0, 'updatedAt' => 0);
if (is_readable($statePath)) {
	$prev = json_decode(file_get_contents($statePath), true);
	if (is_array($prev)) {
		$state = array_merge($state, $prev);
	}
}

$idx = isset($state['currentIndex']) ? (int) $state['currentIndex'] : 0;
$idx = max(0, min($max, $idx));

switch ($action) {
	case 'next':
		$idx = min($max, $idx + 1);
		break;
	case 'prev':
		$idx = max(0, $idx - 1);
		break;
	case 'reset':
		$idx = 0;
		break;
	default:
		http_response_code(400);
		echo json_encode(array('ok' => false, 'error' => 'bad_action'));
		exit;
}

$newState = array(
	'currentIndex' => $idx,
	'updatedAt' => time(),
);

$written = @file_put_contents($statePath, json_encode($newState, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n");
if ($written === false) {
	http_response_code(500);
	echo json_encode(array('ok' => false, 'error' => 'write_failed'));
	exit;
}

echo json_encode(array(
	'ok' => true,
	'currentIndex' => $idx,
	'updatedAt' => $newState['updatedAt'],
), JSON_UNESCAPED_UNICODE);
