<?php
header('Content-Type: application/json');
require 'connexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['name'], $data['capacity'])) {
  $stmt = $pdo->prepare("UPDATE rooms SET name = ?, capacity = ? WHERE id = ?");
  $stmt->execute([$data['name'], $data['capacity'], $data['id']]);
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['error' => 'Missing fields']);
}
?>