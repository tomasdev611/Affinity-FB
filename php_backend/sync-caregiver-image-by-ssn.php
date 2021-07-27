<?php
header('Access-Control-Allow-Origin: *');
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );
require 'vendor/autoload.php';
require 'config.php';

// ==
use Aws\S3\S3Client;
// Create a S3Client

//$credentials = new Aws\Credentials\Credentials ( 'AKIAIPDGAG6JO3TZY45Q', 'mG1F1wl7eD7pkrApbqPUIZ64EEgIVSUOgk6DWKqe' );
$key = 'AKIAIPDGAG6JO3TZY45Q';
$secret = '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' ;


$params =  array(
	'version' => '2006-03-01',
	'region' => 'us-east-1',
	'credentials' => array(
       	 	'key' => $key,
        	'secret' => $secret,
    ),
);

//print_r($params);die;
$s3 = new Aws\S3\S3Client ( $params);
// ==

try {
	$hostname = DB_HOST;
//        $hostname = "34.195.189.103";
	$port = DB_PORT;
	$dbname = DB_NAME;
	$username = DB_USER;
	$pw = DB_PASSWORD;
	$dbh = new PDO ( "dblib:host=$hostname:$port;dbname=$dbname", "$username", "$pw" );
} catch ( PDOException $e ) {
	echo "Failed to get DB handle: " . $e->getMessage () . "\n";
	exit ();
}


$get = $_GET;

if(!$get['ssn']){
	return true;
}else{
//	echo "syncing image ..";
}
// get last 24 hr updated records only
$sql = "select * from dbo.employee where SocialSecurityNum='".$get['ssn']."'";
//$sql = "select * from dbo.employee where  SocialSecurityNum='002436021'";
$stmt1 = $dbh->prepare ( $sql );
$stmt1->execute ();
$i=0;
$time = time();
$temp = array ();
$rows = $stmt1->fetchAll();
foreach( $rows as $key=>$row) {

	$ssn = $row ['SocialSecurityNum'];
	// ==

	$sql = "select * from dbo.tbl_images_employee where SocialSecurityNum='" . $ssn . "'";
	$stmt2 = $dbh->prepare ( $sql );
	$stmt2->execute ();
	$image_row = $stmt2->fetch ();

	// ==
	if ($ssn && $image_row ['SocialSecurityNum'] && $image_row ['bin_image']) {
		$file = file_get_contents ( "http://" . SERVER_HOST . "/scripts/sync-caregiver-images-2.php?id=" . $ssn );
		file_put_contents ( 'employees/images/'.$time.'img' . $ssn . '.jpeg', $file );
		saveToS3 ( $s3, $time."img" . $ssn.'.jpeg', 'employees/images/'.$time.'img' . $ssn . '.jpeg' );
		$temp [] = $ssn;
		$sql = "update dbo.employee set profile_url='".$time."img" . $ssn . ".jpeg' where SocialSecurityNum='" . $ssn . "'";
		$stmt3 = $dbh->prepare ( $sql );
		$stmt3->execute ();
		//echo 'updated';
		echo "Success: " . $time."img" . $ssn.'.jpeg';
	} else {
		echo $ssn . " - no image.";
	}
}

/**
 *
 * @param unknown $s3
 * @param unknown $dest
 * @param unknown $file
 */
function saveToS3($s3, $dest, $file){
	$params = array (
		"Bucket" => "affinityasset",
		'Key' => $dest,
		'Body' => fopen ( $file, 'r' ),
		'ACL' => 'public-read'
	);
	// Send a PutObject request and get the result object.
	$result = $s3->putObject ( $params );
//	print_r ( $result );
}
