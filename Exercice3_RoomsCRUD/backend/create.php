<?php
header('Content-Type: application/json');
require 'connexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['name']) && isset($data['capacity'])) {
  $stmt = $pdo->prepare("INSERT INTO rooms (name, capacity) VALUES (?, ?)");
  $stmt->execute([$data['name'], $data['capacity']]);
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['error' => 'Missing fields']);
}
?>