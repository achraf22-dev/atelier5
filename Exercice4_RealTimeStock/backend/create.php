<?php
header('Content-Type: application/json');
require 'connexion.php';
require 'broadcast.php';

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['product_name']) || !isset($data['quantity'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO stocks (product_name, quantity) VALUES (?, ?)");
$stmt->execute([$data['product_name'], $data['quantity']]);
$id = $pdo->lastInsertId();
$new = ['id' => (int)$id, 'product_name' => $data['product_name'], 'quantity' => (int)$data['quantity']];

broadcastStockUpdate('stock-created', $new);
echo json_encode(['success' => true, 'stock' => $new]);
?>