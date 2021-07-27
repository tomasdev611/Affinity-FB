<?php
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );
//print_r($params);die;

try {
	$hostname = "54.209.252.188";
	$port = 59419;
	$dbname = "dump";
	$username = "affinityweb";
	$pw = 'aff123qwe';
	$dbh = new PDO ( "dblib:host=$hostname:$port;dbname=$dbname", "$username", "$pw" );
} catch ( PDOException $e ) {
	echo "Failed to get DB handle: " . $e->getMessage () . "\n";
	exit ();
}

$file = $_GET['x'];
//https://s3.amazonaws.com/affinityasset/img000000073.jpeg
$binary = file_get_contents ( "https://s3.amazonaws.com/affinityasset/" . $file );
$ex1 = explode("img",$file);
$filename = $ex1[1];
$ex2 = explode(".",$filename);
$ssn = $ex2[0];

echo utf8_encode($binary);die;


$sql = "update dbo.tbl_images_employee set bin_image='" . utf8_encode($binary) . "' where SocialSecurityNum='" . $ssn . "'";

$stmt3 = $dbh->prepare ( $sql );
$stmt3->execute ();
