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

// get last 24 hr updated records only
$sql = "select * from dbo.caregiverAttachments";
$stmt1 = $dbh->prepare ( $sql );
$stmt1->execute ();
$i=0;
$temp = array ();
$rows = $stmt1->fetchAll();
foreach( $rows as $key=>$row) {
	
	$clientid = $row ['socialSecNum'];
	$attachmentid = $row['attachmentId'];
	$attachment = $row['attachment'];
	// ==
	$pdf = $clientid.$attachmentid.time();
	if ($attachment) {
		$file = file_get_contents ( "http://54.166.218.128/scripts/sync-caregiver-attachment-l-to-w-2.php?aid=".$attachmentid."&cid=" . $clientid );
		file_put_contents ( 'caregivers/' . $pdf . '.pdf', $file );
		saveToS3 ( $s3, $pdf.'.pdf', 'caregivers/' . $pdf . '.pdf' );
		$sql = "update dbo.caregiverAttachments set str_filename='" . $file . "' where str_filename='' and socialSecNum='". $clientid . "' and attachmentid='".$attachmentid."'";
		$stmt3 = $dbh->prepare ( $sql );
		//$stmt3->execute ();
		//echo 'updated';

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
