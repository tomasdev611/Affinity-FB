<?php
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );
require 'vendor/autoload.php';

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
$files = array_diff(scandir('../../api/public/uploads'), array('.', '..'));

// get last 24 hr updated records only
foreach( $files as $key=>$value) {
	$file_name = $value;
	$file_path = '../../api/public/uploads/'.$file_name;
	saveToS3 ( $s3, $file_name, $file_path );
	unlink($file_path);

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
