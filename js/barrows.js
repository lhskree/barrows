$(document).ready(function () {

	// Read the 3 most recent posts
	$.post("./php/read.php", { query : "all" })
	.success(function (data) {
		renderRecentPosts(data);
	})
	.fail(function () {

	});

	// Load 3 more posts
		// Button click get more posts

	$("#submit").click(function () {

		
		$.post("./php/create.php", $("#createPost").serialize())
		.success(function (data) {
			$.post("./php/read.php", { query : "all" })
				.success(function (data) {
					console.log("Rendering");
					renderRecentPosts(data);
				})
				.fail(function () {

				});
		})
		.fail(function () {
			console.log("Failed to get data.");
		});

	});

});

function renderRecentPosts (posts) {

	$pl = $("#postsListing");
	$pl.empty();

	posts.forEach(function (post) {

		var template = _.template($("#postSnippet").html());
		$pl.append(template(post));
		bindClickHandler(post.id);

	});

}

function bindClickHandler(id) {

	$("#postUnlock-" + id).click(function () {

		var key = "#postKey-" + id;
		var key = escape($(key).val());

		var data = {"req":"unlock","key":key,"id":id};
		console.log(data);

		$.post("./php/unlock.php", data)
		.success(function (data) {

			console.log(data);
			$("#post-" + data.id + " .postBodyContent").text(data.body);

		})
		.fail(function () {

			console.log("Something went wrong while decrypting. . .");

		});

	});

}