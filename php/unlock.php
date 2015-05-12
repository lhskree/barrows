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

if ($_POST["req"] === "unlock") {

	$id = $_POST["id"];
	$key = $_POST["key"];

	$query = "SELECT * FROM posts WHERE id = '" . $id . "'";

	if ($result = $mysqli->query($query)) {

		$row = $result->fetch_row();
		$bodyEnc = $row[3];
		$iv_size = $row[8];
		$bodyDec = base64_decode($bodyEnc);
		$ivDec = substr($bodyDec, 0, $iv_size);
		$ciphertext = substr($bodyDec, $iv_size);
		$body = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $ciphertext, MCRYPT_MODE_CBC, $ivDec);

		$response["Success"] = true;
		$response["body"] = $body;
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