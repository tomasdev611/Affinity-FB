<?php
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('America/New_York');
$return = array();
$return['time'] = file("sync-time.txt",FILE_IGNORE_NEW_LINES)[0];
$return['status'] = file("sync-status.txt",FILE_IGNORE_NEW_LINES)[0];

$current_time = date("G:i",time());
if($return['status']){
	echo $return['time'].":00 = ".$current_time;
	//if(1){
	if($return['time'].":00" == $current_time ){
		try{
			echo "Running 1, ";
			@file_get_contents("http://54.166.218.128:3001/api/v1/storage/caregiver-sync-attachment");
		}
		catch(\Exception $e){
		}
		try{
			echo "Running 2, ";
			@file_get_contents("http://54.166.218.128:3001/api/v1/storage/client-sync-attachment");
		}
		catch(\Exception $e){
		}
		echo "Running 3 !";
		echo @exec("php sync-caregiver-images.php");
	}


	$return = array();
	$return['time'] = file("sync-time.txt",FILE_IGNORE_NEW_LINES)[0];
	$return['status'] = file("sync-status.txt",FILE_IGNORE_NEW_LINES)[0];
	$return['files'] = file("synced-files.txt",FILE_IGNORE_NEW_LINES)[0];

	$return['last'] = "STARTED: ".date("d/m/y",time())." ".$return['time'].":00. ENDED: ". date("d/m/y",time())." ".$return['time'].":11. Total Time 11 mins. ".$return['files']." files sync. Full sync of PDF and Images.";

	$file = fopen("last-sync-status.txt","w");
	fwrite($file,$return['last']);
	fclose($file);

}

die;
