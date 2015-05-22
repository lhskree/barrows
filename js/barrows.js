$(document).ready(function () {

	// Read the 3 most recent posts
	$.post("./php/read.php", { query : "all" })
	.success(function (data) {
		renderRecentPosts(data);
	})
	.fail(function () {
		console.log("Unable to access database.");
	});

	// Load 3 more posts
	// Button click get more posts

});


function renderRecentPosts (posts) {

	$pl = $("#postsListing");
	$pl.empty();

	posts.forEach(function (post) {

		var template = _.template($("#postSnippet").html());
		$pl.append(template(post));
		bindClickHandlers(post.id);

	});

}

function bindClickHandlers(id) {
	var $show = $("#showUnlock-" + id);
	var $key = $("#postKey-" + id);
	var $unlock = $("#postUnlock-" + id);

	$show.click(function () {

		if (!$(this).hasClass("toggled")) {
			$(this).addClass("toggled");
			$key.css({"width": "150px", "visibility":"visible"});
			$unlock.css({"width": "150px", "visibility":"visible"});
		} else {
			$(this).removeClass("toggled");
			$key.css({"width": "", "visibility":"hidden"});
			$unlock.css({"width": "", "visibility":"hidden"});
		}

	});

	$unlock.click(function () {

		var key = escape($key.val());

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