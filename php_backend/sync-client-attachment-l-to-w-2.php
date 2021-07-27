<?php
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );
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

if ($_GET ['aid'] && $_GET ['cid']) {
	$stmt = $dbh->prepare ( "select * from dbo.clientAttachments where clientid='" . $_GET ['cid'] . "' and attachmentid='" . $_GET ['aid'] . "'" );
	$stmt->execute ();
	$row = $stmt->fetch ();
	
	if ($row ['attachment']) {
		$binary = $row ['attachment'];
                //file_put_contents ( 'clients/' . time() . 'yy.pdf', base64_encode($binary ));
		//header ( "Cache-control: " );
		//header ( "Pragma:");
		//header ( 'Content-Disposition: inline; filename="' . time() . '"');
		//header ( "Content-transfer-encoding:binary" );
		header ( "Content-type: application/pdf" );
		header('Content-Length: ' . strlen(base64_encode($binaryi)));
		header('Accept-Ranges: bytes');

		echo $binary;
	} else {
		echo "Invalid ID.";
	}
} else {
	echo "Invalid  ID";
}
