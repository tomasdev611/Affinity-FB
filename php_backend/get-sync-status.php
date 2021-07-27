<?php
header('Access-Control-Allow-Origin: *');

$return = array();
$return['time'] = file("sync-time.txt",FILE_IGNORE_NEW_LINES)[0];
$return['status'] = file("sync-status.txt",FILE_IGNORE_NEW_LINES)[0];
$return['files'] = file("synced-files.txt",FILE_IGNORE_NEW_LINES)[0];
$return['last'] = file("last-sync-status.txt",FILE_IGNORE_NEW_LINES)[0];
echo json_encode($return);
die;
