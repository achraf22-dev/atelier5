<?php
header('Content-Type: application/json');
require 'connexion.php';
require 'broadcast.php';

// Log that delete.php is being hit
file_put_contents("log.txt", "DELETE called\n", FILE_APPEND);

// Read and log input
$input = file_get_contents('php://input');
$data = json_decode($input, true);
file_put_contents("log.txt", "DELETE input: " . $input . "\n", FILE_APPEND);

// Validate input
if (!isset($data['id'])) {
    file_put_contents("log.txt", "ERROR: ID missing\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['error' => 'ID manquant']);
    exit;
}

// Execute deletion
$stmt = $pdo->prepare("DELETE FROM stocks WHERE id = ?");
$success = $stmt->execute([$data['id']]);

if ($success) {
    file_put_contents("log.txt", "Deleted from DB: ID " . $data['id'] . "\n", FILE_APPEND);

    // Broadcast deletion event
    broadcastStockUpdate('stock-deleted', ['id' => (int)$data['id']]);
    file_put_contents("log.txt", "Broadcasted deletion: ID " . $data['id'] . "\n", FILE_APPEND);

    echo json_encode(['success' => true, 'id' => (int)$data['id']]);
} else {
    file_put_contents("log.txt", "ERROR: DB deletion failed for ID " . $data['id'] . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Échec de suppression']);
}
?>
