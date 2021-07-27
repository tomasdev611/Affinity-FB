<?php
while (@ob_end_clean());
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

// get last 24 hr updated records onlyi
$sql =  "select * from dbo.clientAttachments where clientid='30' and attachmentid='85' ";
$stmt2 = $dbh->prepare ( $sql );
$stmt2->execute ();
$row = $stmt2->fetch ();	


$file = fopen($row['str_filename'],"w");
fwrite($file,$row['attachment']);
fclose($file);

header('Content-type: application/pdf');
  header('Content-Disposition: inline; filename="' . $row['str_filename']. '"');
  header('Content-Transfer-Encoding: binary');
  header('Accept-Ranges: bytes');
//  echo file_get_contents($file);
readfile($row['str_filename']);

//echo file_get_contents("test.pdf");
die;

//saveToS3 ( $s3, $row['str_filename'],$row['str_filename'] );
//$temp [] = $ssn;
//$sql = "update dbo.employee set profile_url='img" . $ssn . ".jpeg' where SocialSecurityNum='" . $ssn . "'";
//$stmt3 = $dbh->prepare ( $sql );
//$stmt3->execute ();


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
