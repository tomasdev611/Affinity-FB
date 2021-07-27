<?php
header('Access-Control-Allow-Origin: *');
ini_set ( 'display_errors', true );
error_reporting ( E_ALL - E_NOTICE - E_WARNING );

$get = $_GET;


$s = file("get-minor-sync-status.txt",FILE_IGNORE_NEW_LINES)[0];

if($get['toggle']){

$file = fopen("get-minor-sync-status.txt","w");
	if($s){
		$s = 0;
		fwrite($file,0);
	}else{
		$s = 1;
		fwrite($file,1);
	}
}
fclose($file);
echo $s;
die;



