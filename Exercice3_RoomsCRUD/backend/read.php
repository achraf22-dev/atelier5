<?php
header('Content-Type: application/json');
require 'connexion.php';

$stmt = $pdo->query("SELECT * FROM rooms");
$rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rooms);
?>
