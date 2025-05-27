<?php
header('Content-Type: application/json');
require 'connexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
  $stmt = $pdo->prepare("DELETE FROM rooms WHERE id = ?");
  $stmt->execute([$data['id']]);
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['error' => 'Missing ID']);
}
?>