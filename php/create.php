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

// If the table doesn't exist, set it up
$result = $mysqli->query("SHOW TABLES LIKE 'posts'");

if (strlen($mysqli->error) === 0 || !$result) {
	$createPosts = "CREATE TABLE IF NOT EXISTS posts "
		. "(author VARCHAR(20), "
		. "title VARCHAR(50), "
		. "subtitle VARCHAR(30), "
		. "body TEXT, "
		. "date TIMESTAMP, "
		. "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
		. "draft BOOLEAN NOT NULL, "
		. "locked BOOLEAN NOT NULL, "
		. "PRIMARY KEY (id))";

	if ($mysqli->query($createPosts) === TRUE) {
		$response["Created Post"] = "Successfully created 'posts'.";
	} else {
		$response["Created Post"] = "Invalid query : " . $mysqli->error;
	}
}

if ($_POST["req"] === "save") {

	// The post already exists
	if ($_POST["id"]) {

		$query = "UPDATE posts SET title = '" . $mysqli->escape_string($_POST["title"]) . "', "
			. "subtitle = '" . $mysqli->escape_string($_POST["subtitle"]) . "', "
			. "body = '" . $mysqli->escape_string($_POST["body"]) . "' WHERE id = '" . $_POST["id"] . "'";

		if ($mysqli->query($query) === TRUE) {
			$response["Success"] = true;
			$response["Updated"] = true;
			$response["id"] = $_POST["id"];
		} else {
			$response["Error"] = "Error inserting query " . $query . "<br>" . $mysqli->error;
		}
	} else {

		// The post doesn't already exist
		$query = "INSERT INTO posts (author, title, subtitle, body, date, draft, locked) VALUES ("
			. "'" . $mysqli->escape_string($_POST["author"]) . "', "
			. "'" . $mysqli->escape_string($_POST["title"]) . "', "
			. "'" . $mysqli->escape_string($_POST["subtitle"]) . "', "
			. "'" . $mysqli->escape_string($_POST["body"]) . "', "
			. "'" . date('YmdHis') . "', "
			. "'" . true . "', "
			. "'" . false . "')";

		if ($mysqli->query($query) === TRUE) {
			$response["Success"] = true;
			$response["id"] = $mysqli->insert_id;
		} else {
			$response["Error"] = "Error inserting query " . $query . "<br>" . $mysqli->error;
		}
	}
}

if ($_POST["req"] === "lock") {

	// Create the post in the posts table
	$query = "INSERT INTO posts (author, title, subtitle, body, date, draft, locked) VALUES ("
		. "'" . $mysqli->escape_string($_POST["author"]) . "', "
		. "'" . $mysqli->escape_string($_POST["title"]) . "', "
		. "'" . $mysqli->escape_string($_POST["subtitle"]) . "', "
		. "'" . $mysqli->escape_string($_POST["body"]) . "', "
		. "'" . date('YmdHis') . "', "
		. "'" . false . "', "
		. "'" . true . "')";

	if ($mysqli->query($query) === TRUE) {
		$response["Success"] = true;
	} else {
		$response["Error"] = "Error inserting query " . $query . "<br>" . $mysqli->error;
	}
}

// Send the client response
header("Content-Type: application/json");
echo json_encode($response);
exit;

?>