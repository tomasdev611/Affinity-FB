<?php
ini_set ( 'display_errors', true );
error_reporting(E_ALL-E_NOTICE-E_WARNING);
require('config.php');

  try {
    $hostname = DB_HOST;
    $port = DB_PORT;
    $dbname = DB_NAME;
    $username = DB_USER;
    $pw = DB_PASSWORD;

    $dbh = new PDO ("dblib:host=$hostname:$port;dbname=$dbname","$username","$pw");
  } catch (PDOException $e) {
    echo "Failed to get DB handle: " . $e->getMessage() . "\n";
    exit;
  }
  $stmt = $dbh->prepare("select * from dbo.tbl_images_employee where SocialSecurityNum='".$_GET['id']."'");
  $stmt->execute();

$temp = array();
$row = $stmt->fetch();

header("Content-Type: image/jpeg");
// header("Content-type: img/". $row['bin_image']);
echo $row['bin_image'];

