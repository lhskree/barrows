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

	if ($mysqli->query($createSettings) === true) {
		$response["Created Settings"] = "Successfully created 'settings'.";
	} else {
		$response["Created Settings"] = "Invalid query : " . $mysqli->error;
	}
}

// If there's a request to make a user account
if ($_POST) {
	if (isset($_POST["createUser"])) {

		$u = $mysqli->real_escape_string($_POST["username"]);
		$p1 = $mysqli->real_escape_string($_POST["pass1"]);
		$p2 = $mysqli->real_escape_string($_POST["pass2"]);

		if ($u !== $_POST["username"]
			|| $p1 !== $_POST["pass1"]
			|| $p2 !== $_POST["pass2"]
			|| $p1 !== $p2) {

			$response["validationError"] = true;
			header("Content-Type: application/json");
			echo json_encode($response);
			exit;
		} else {

			$query = "INSERT INTO settings (author, pass) VALUES('" . $u . "', '" . $p1 . "')";

			if ($mysqli->query($query) === true) {

				$response["accountCreated"] = true;
				header("Content-Type: application/json");
				header("Cookie: loggedin=true");
				echo json_encode($response);
				exit;
			} else {
				$response["insertError"] = "Invalid query : " . $mysqli->error;
				header("Content-Type: application/json");
				echo json_encode($response);
				exit;
			}
		}
		
	}
} else {
	// Check if a user has been created
	$result = $mysqli->query("SELECT * FROM settings");

	// There's no user
	if (!$result->num_rows) {
		header("Content-Type: application/json");
		echo json_encode(["userExists" => false,
			"form" => "<h1>Create an Authoring Account</h1>"
			. "<form id='createUser'>"
			. "<label for='username'>Username</label>"
			. "<input type='text' id='username' name='username' required>"
			. "<span id='usernameError'>Username must be at least 8 characters</span>"
			. "<label for='pass1'>Password</label>"
			. "<input type='password' id='pass1' name='pass1' required>"
			. "<span id='passwordError1'>Passwords must be 16 characters</span>"
			. "<label for='pass2'>Password (Again)</label>"
			. "<input type='password' id='pass2' name='pass2' required>"
			. "<span id='passwordError2'>Passwords must match</span>"
			. "<input type='hidden' name='createUser' value='true'>"
			. "</form>"
			. "<button id='submitCreateUser'>Submit</button>"]);
		exit;
	} else {
		// There is a user
		header("Content-Type: application/json");
		echo json_encode(["userExists" => true,
			"form" => "<h1>Login to Authoring Account</h1>"
			. "<form id='userLogin'>"
			. "<label for='username'>Username</label>"
			. "<input type='text' id='username' name='username' value='' placeholder='Username' required>"
			. "<span id='usernameAuthError'>Username must be at least 8 characters</span>"
			. "<label for='password'>Password</label>"
			. "<input type='password' id='password' name='password' value='' placeholder='Password' required>"
			. "<span id='passwordAuthError'>Passwords must be 16 characters</span>"
			. "</form>"
			. "<button id='login'>Login</button>"]);
		exit;
	}
}

?>