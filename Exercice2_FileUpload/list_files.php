<?php
header('Content-Type: application/json');

$dir = __DIR__ . '/uploads/';
$files = [];
if (is_dir($dir)) {
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        $files[] = $f;
    }
}
echo json_encode($files);
?>