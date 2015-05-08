$(document).ready(function () {

	$.post("./init.php")
	.success(function (data) {

		// If there's no user data, show the create authoring account form
		if (!data.userExists) {

			// Add the form to the outlet
			$("#outlet").append(data.form);

			$("#usernameError").hide();
			$("#passwordError1").hide();
			$("#passwordError2").hide();

			// Register submit handler
			$("#submitCreateUser").click(validateCreateAuth);
		} else {

			// Show the login form

			// Add the form to the outlet
			$("#outlet").append(data.form);

			// Bind the click handler
			$("#login").click(validateLogin);

		}
	})
	.fail(function () {
		console.log("Failed.");
	});

});

function validateCreateAuth() {
	
	var valid = true;

	var u = $("#username").val();
	
	if (u.length < 8) {
		$("#usernameError").show();
		valid = false;
	} else {
		$("#usernameError").hide();
	}

	var p1 = $("#pass1").val(),
		p2 = $("#pass2").val();

	if (p1.length < 16 || p2.length < 16) {
		$("#passwordError1").show();
		valid = false;
	} else {
		$("#passwordError1").hide();
	}

	if (p1 !== p2) {
		$("#passwordError2").show();
		valid = false;
	} else {
		$("#passwordError2").hide();
	}

	if (valid) {
		console.log("Validated. Attempting account creation . . .");
		$.post("./init.php", $("#createUser").serialize())
		.success(function (data) {
			console.log(data);
		})
		.fail(function () {
			console.log("Failed to connect to init.php");
		});
	}

}

function validateLogin() {

	var valid = true;

	var u = $("#username").val();
	var p = $("#password").val();

	var eu = escape(u);
	var ep = escape(p);
	console.log(u + eu + p + ep);

	if (u !== eu || p !== ep) valid = false;

	if (valid) {
		console.log("Validated. Attempting login . . .");
		$.post("./login.php", $("#userLogin").serialize())
		.success(function (data) {
			console.log(data);
		})
		.fail(function () {
			console.log("Failed to connect to login.php");
		})
	}

}