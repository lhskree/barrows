$(document).ready(function () {

	$("#noPosts").hide();
	//$("#editInterface").hide();

	// Request all posts
	$.post("./php/auth.php", { "req" : "allPosts"})
	.success(function (data) {

		if (data.posts.length) {

		} else {
			$("#noPosts").show().mouseenter(function () {
				$("#createPostBtn").addClass("hover").css("bottom", "5em");
			})
			.mouseleave(function () {
				$("#createPostBtn").removeClass("hover").css("bottom","1em");
			});
		}

	})
	.fail(function () {
		console.log("Failed to GET allPosts");
	});

	$("#createPostBtn").click(function () {
		$("#editInterface").slideDown('slow');
	});

});