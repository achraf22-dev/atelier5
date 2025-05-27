<?php
// Broadcast helper using Pusher
require __DIR__ . '/../vendor/autoload.php';

$options = [
    'cluster' => 'eu',    // ← make sure this matches your Pusher dashboard
    'useTLS'  => true
];
$pusher = new Pusher\Pusher(
    '5afeb390ed7c75a87c3d',
    '5d3a50ed41c19bc16b3a',
    '1999337',
    $options
);

function broadcastStockUpdate($event, $data) {
    global $pusher;
    $pusher->trigger('stocks-channel', $event, $data);
}
?>
