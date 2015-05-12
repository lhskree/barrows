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

$query = "SELECT * FROM posts WHERE locked = true ORDER BY date DESC";

if ($result = $mysqli->query($query)) {

	// Fetch only 3 rows to start
	$i = 0;
	while ($row = $result->fetch_row()) {
		$response[$i] = [
			"author" => $row[0],
			"title" => $row[1],
			"subtitle" => $row[2],
			"body" => $row[3],
			"date" => $row[4],
			"id" => $row[5]
			];
		$i++;
		if ($i === 3) break;
	}

} else {
	$response["Error"] = "Error performing query " . $query . "<br>" . $mysqli->error;
}

// Send the response to the client
header('Content-Type: application/json');
echo json_encode($response);

exit;

?>