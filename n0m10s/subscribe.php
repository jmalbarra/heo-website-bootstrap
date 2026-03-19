<?php
/**
 * n0m10s - Guarda suscripciones (nombre, email) en el servidor.
 * Compatible con InfinityFree (PHP).
 * Guarda en data/subscribers.json con nombre, email, IP y timestamp.
 */
header('Content-Type: application/json; charset=utf-8');

// CORS: permitir requests desde el mismo dominio (InfinityFree, custom domains)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && preg_match('#^https?://[\w.-]+#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || !isset($data['name']) || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan nombre o email']);
    exit;
}

$name = trim((string) $data['name']);
$email = trim(strtolower((string) $data['email']));

if (strlen($name) < 1 || strlen($name) > 64) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Nombre inválido']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 128) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email inválido']);
    exit;
}

// IP de conexión (servidor la conoce)
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
if (strpos($ip, ',') !== false) {
    $ip = trim(explode(',', $ip)[0]);
}

$entry = [
    'name' => $name,
    'email' => $email,
    'ip' => $ip,
    'ts' => time(),
];

$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$file = $dir . '/subscribers.json';
$list = [];
if (file_exists($file)) {
    $list = json_decode(file_get_contents($file), true) ?: [];
}
$list[] = $entry;
file_put_contents($file, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['ok' => true]);
