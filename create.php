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
$result = $mysqli->query("SHOW TABLES LIKE posts");

if (!mysqli_num_rows($result)) {
	$createPosts = "CREATE TABLE IF NOT EXISTS posts "
		. "(author VARCHAR(20), "
		. "title VARCHAR(50), "
		. "subtitle VARCHAR(30), "
		. "body TEXT, "
		. "date TIMESTAMP, "
		. "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
		. "PRIMARY KEY (id))";

	if ($mysqli->query($createPosts) === TRUE) {
		$response["Created Post"] = "Successfully created 'posts'.";
	} else {
		$response["Created Post"] = "Invalid query : " . $mysqli->error;
	}
}

// Create the post in the posts table
$query = "INSERT INTO posts (author, title, subtitle, body, date) VALUES ("
	. "'" . $mysqli->escape_string($_POST["author"]) . "', "
	. "'" . $mysqli->escape_string($_POST["title"]) . "', "
	. "'" . $mysqli->escape_string($_POST["subtitle"]) . "', "
	. "'" . $mysqli->escape_string($_POST["body"]) . "', "
	. "'" . date('YmdHis') . "')";

if ($mysqli->query($query) === TRUE) {
	$response["Success"] = true;
} else {
	$response["Error"] = "Error inserting query " . $query . "<br>" . $mysqli->error;
}

// Send the response to the client
echo json_encode($response);

exit;

?>