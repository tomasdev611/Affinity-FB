<?php
ini_set ( 'display_errors', true );
error_reporting(E_ALL-E_NOTICE-E_WARNING);
  try {
    $hostname = "54.209.252.188";
    $port = 59419;
    $dbname = "dump";
    $username = "affinityweb";
    $pw = 'aff123qwe';
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
header("Content-type: img/". $row['bin_image']);
echo $row['bin_image'];

