<?php

// Connect to the db
$mysqli = new mysqli('localhost', 'root', '', 'mysql');

$response = [];

// Connect error
if ($mysqli->connect_error) {
	$response["Error"] = 'Connec Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error;
	header("Content-type: application/json");
	echo json_encode($response);
	exit;
}

if ($_POST["req"] === "lock") {

	$str = $_POST["body"];
	$key = hash("md5", (microtime().rand()));
	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	// Initialization vector
	$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
	$ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $str, MCRYPT_MODE_CBC, $iv);
  $encBody = base64_encode($iv . $ciphertext);

	// Create the post in the posts table
	$query = "UPDATE posts SET title = '" . $mysqli->escape_string($_POST["title"]) . "', "
		. "subtitle = '" . $mysqli->escape_string($_POST["subtitle"]) . "', "
		. "body = '" . $encBody . "', "
		. "draft = '" . false . "', "
		. "locked = '" . true . "', "
		. "iv = '" . $iv_size . "' WHERE id = '" . $_POST["id"] . "'";

	if ($mysqli->query($query) === TRUE) {
		$response["Success"] = true;
		$response["key"] = $key;
		$response["id"] = $_POST["id"];
	} else {
		$response["Error"] = "Error inserting query " . $query . "<br>" . $mysqli->error;
	}
}

// Send the client response
header("Content-Type: application/json");
echo json_encode($response);
exit;

?>