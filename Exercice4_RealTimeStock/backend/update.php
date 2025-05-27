<?php
header('Content-Type: application/json');
require 'connexion.php';
require 'broadcast.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'], $data['product_name'], $data['quantity'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

$stmt = $pdo->prepare("UPDATE stocks SET product_name = ?, quantity = ? WHERE id = ?");
$stmt->execute([$data['product_name'], $data['quantity'], $data['id']]);
$updated = ['id' => (int)$data['id'], 'product_name' => $data['product_name'], 'quantity' => (int)$data['quantity']];

broadcastStockUpdate('stock-updated', $updated);
echo json_encode(['success' => true, 'stock' => $updated]);
?>