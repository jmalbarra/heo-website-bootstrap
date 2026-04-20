<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

$root = dirname(__DIR__);
$path = $root . '/data/state.json';

if (!is_readable($path)) {
	echo json_encode(array(
		'currentIndex' => 0,
		'updatedAt' => time(),
		'enabled' => true,
	), JSON_UNESCAPED_UNICODE);
	exit;
}

$raw = file_get_contents($path);
$data = json_decode($raw, true);
if (!is_array($data)) {
	$data = array();
}

$idx = isset($data['currentIndex']) ? (int) $data['currentIndex'] : 0;
$updated = isset($data['updatedAt']) ? (int) $data['updatedAt'] : 0;
$enabled = isset($data['enabled']) ? (bool) $data['enabled'] : true;

echo json_encode(array(
	'currentIndex' => $idx,
	'updatedAt' => $updated,
	'enabled' => $enabled,
), JSON_UNESCAPED_UNICODE);
