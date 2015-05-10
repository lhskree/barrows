$(document).ready(function () {

	$.post("./php/init.php")
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

			var $u = $("#username");
			var $p = $("#password1");
			var $p2 = $("#password2");

			// Bind to enter
			$(window).keydown(function (e) {

				if (e.keyCode == 13) {
					validateCreateAuth();
				}

			});

		} else {

			// Show the login form

			// Add the form to the outlet
			$("#outlet").append(data.form);

			$("#usernameAuthError").hide();
			$("#passwordAuthError").hide();

			// Bind the click handler
			$("#login").click(validateLogin);

			var $u = $("#username");
			var $p = $("#password");

			// Bind to enter
			$(window).keydown(function (e) {

				if (e.keyCode == 13) {
					validateLogin();
				}

				if ($u.val().length < 8) {
					$("#usernameAuthError").show();
				} else {
					$("#usernameAuthError").hide();
				}

				if ($p.val().length < 16) {
					$("#passwordAuthError").show();
				} else {
					$("#passwordAuthError").hide();
				}

			});

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
		$.post("./php/init.php", $("#createUser").serialize())
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

	var $u = $("#username");
	var $p = $("#password");

	var u = $u.val();
	var p = $p.val();

	var eu = escape(u);
	var ep = escape(p);

	if (u !== eu || p !== ep) {
		valid = false;
	}

	if (valid) {
		console.log("Validated. Attempting login . . .");
		$.post("./php/login.php", $("#userLogin").serialize())
		.success(function (data, textStatus, XMLHttpRequest) {

			if (data.success) {

				document.cookie = "user=" + data.user;
				window.location.href= "./auth.html";

			} else {

				// This should be handled with a message
				console.log("Server-side authentication failed.");
			}
		})
		.fail(function () {
			console.log("Failed to connect to login.php");
		});
	}

}