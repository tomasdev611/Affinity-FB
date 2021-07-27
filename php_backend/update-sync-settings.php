<?php
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );

// try {
// 	$hostname = "54.209.252.188";
// 	$port = 59419;
// 	$dbname = "dump";
// 	$username = "affinityweb";
// 	$pw = 'aff123qwe';
// 	$dbh = new PDO ( "dblib:host=$hostname:$port;dbname=$dbname", "$username", "$pw" );
// } catch ( PDOException $e ) {
// 	echo "Failed to get DB handle: " . $e->getMessage () . "\n";
// 	exit ();
// }


$get = $_GET;

$file = fopen("sync-".$get['type'].".txt","w");
fwrite($file,$get['value']);
fclose($file);



