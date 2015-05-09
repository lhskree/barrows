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
$result = $mysqli->query("SHOW TABLES LIKE 'posts'");

if (!$result) {
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

if ($_POST["req"] === "allPosts") {
	
	$query = "SELECT * FROM posts";

	if ($result = $mysqli->query($query)) {

		$posts = [];

		while ($row = $result->fetch_row()) {
			$posts[$row[5]] = [
				"author" => $row[0],
				"title" => $row[1],
				"subtitle" => $row[2],
				"body" => $row[3],
				"date" => $row[4]
				];
		}
		$response["success"] = true;
		$response["posts"] = $posts;
	} else {
		$response["Error"] = "Error performing query " . $query . "<br>" . $mysqli->error;
		$response["success"] = false;
	}
	header("Content-type: application/json");
	echo json_encode($response);
}

if ($_POST["req"] === "") {
	
}

if ($_POST["req"] === "") {
	
}

?>