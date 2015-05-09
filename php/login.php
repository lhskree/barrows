<?php

// Connect to the db
$mysqli = new mysqli('localhost', 'root', '', 'mysql');

$response = [];

// Connect error
if ($mysqli->connect_error) {
	$response["Error"] = 'Connec Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error;
	echo json_encode($response);
	exit;
}

$query = "SELECT * from settings";

if ($result = $mysqli->query($query)) {


	$row = $result->fetch_row();
	$db_u = $row[0];
	$db_p = $row[1];
	$client_u = $_POST["username"];
	$client_p = $_POST["password"];

	if ($db_u === $client_u && $db_p === $client_p) {
		$response["success"] = true;
		header("Set-Cookie: loggedin=true;"); // Set a loggedin cookie
		echo json_encode($response);
		exit;
	} else {
		$response["success"] = false;
	}
	header("Content-Type: application/json");
	echo json_encode($response);
	exit;

} else {
	$response["Error"] = "Error performing query " . $query . "<br>" . $mysqli->error;
	header("Content-Type: application/json");
	echo json_encode($response);
	exit;
}

?>