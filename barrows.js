$(document).ready(function () {

	// Read the 3 most recent posts
	$.post("./read.php", { query : "all" })
	.success(function (data) {
		console.log(data);
	})
	.fail(function () {

	});

	// Load 3 more posts
		// Button click get more posts

	$("#submit").click(function () {

		
		$.post("./create.php", $("#createPost").serialize())
		.success(function (data) {
			console.log(data);
		})
		.fail(function () {
			console.log("Failed to get data.");
		});

	});

});