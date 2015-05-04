$(document).ready(function () {

	// Read the 3 most recent posts
	$.post("./read.php", { query : "all" })
	.success(function (data) {
		var resp = data;
		renderRecentPosts(resp);
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

function renderRecentPosts (posts) {

	$pl = $("#postsListing");

	posts.forEach(function (post) {

		var template = _.template($("#postSnippet").html());
		$pl.append(template(post));

	});

}