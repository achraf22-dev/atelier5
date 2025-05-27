<?php
header('Content-Type: application/json');
require 'connexion.php';

$stmt = $pdo->query("SELECT * FROM stocks ORDER BY id");
$stocks = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($stocks);
?>