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
	// this is live IP confirmed on 2 dec 2018
	$hostname = "54.209.252.188";
	// this is cloned
	//$hostname = "34.195.189.103";
	$port = 59419;
	$dbname = "Affinity";
	$username = "affinityweb";
	$pw = 'aff123qwe';
	$dbh = new PDO ( "dblib:host=$hostname:$port;dbname=$dbname", "$username", "$pw" );
} catch ( PDOException $e ) {
	echo "Failed to get DB handle: " . $e->getMessage () . "\n";
	exit ();
}

// get last 24 hr updated records only
$sql = "select * from dbo.employee where lastUpdated > dateadd(day,-3, getdate())";
//$sql = "select * from dbo.employee where  SocialSecurityNum='002436021'";
$stmt1 = $dbh->prepare ( $sql );
$stmt1->execute ();
$i=0;
$temp = array ();
$time = time();
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
		$file = file_get_contents ( "http://54.166.218.128/scripts/sync-caregiver-images-2.php?id=" . $ssn );
		file_put_contents ( 'employees/images/'.$time.'img' . $ssn . '.jpeg', $file );
		saveToS3 ( $s3,$time."img" . $ssn.'.jpeg', 'employees/images/'.$time.'img' . $ssn . '.jpeg' );
		$temp [] = $ssn;
		$sql = "update dbo.employee set profile_url='".$time."img" . $ssn . ".jpeg' where SocialSecurityNum='" . $ssn . "'";
		$stmt3 = $dbh->prepare ( $sql );
		$stmt3->execute ();
		@unlink('employees/images/'.$time.'img' . $ssn . '.jpeg');
		//echo i'updated';

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
