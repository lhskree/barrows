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

// If the table doesn't exist, set it up
$result = $mysqli->query("SHOW TABLES LIKE settings");

if (!$result) {
	$createSettings = "CREATE TABLE IF NOT EXISTS settings "
		. "(author VARCHAR(20), "
		. "pass VARCHAR(50), "
		. "PRIMARY KEY (pass))";

	if ($mysqli->query($createSettings) === TRUE) {
		$response["Created Settings"] = "Successfully created 'settings'.";
	} else {
		$response["Created Settings"] = "Invalid query : " . $mysqli->error;
	}
}

// Check if a user has been created
$result = $mysqli->query("SELECT * FROM settings");

if (!$result->num_rows) {
	header("Content-Type: application/json");
	echo json_encode(["userExists" => false,
		"form" => "<h1>Create an Authoring Account</h1>"
		. "<form id='createUser'>"
		. "<label for='username'>Username</label>"
		. "<input type='text' id='username' name='username'>"
		. "<label for='pass1'>Password</label>"
		. "<input type='password' id='pass1' name='pass1'>"
		. "<label for='pass2'>Password (Again)</label>"
		. "<input type='password' id='pass2' name='pass2'>"
		. "</form>"]);
	exit;
}

?>