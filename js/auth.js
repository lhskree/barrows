var postsMap = {}; // All active posts
var editorOpen = false;

$(document).ready(function () {

	$("#noPosts").hide();
	$("#editInterface").hide();

	getPosts();

	// Show / hide the editor
	$("#createPostBtn").click(showEditor);

	$("#closeEditor").click(hideEditor);

	// selecting formatting options
	$("#formattingOptions li").click(function (e) {
		e.stopPropagation();
		$("#formattingOptions li").removeClass("selected");
		$(this).addClass("selected");
	});

	$(window).click(function () {
		$("#formattingOptions li").removeClass("selected");
	});

	// Post request save

	$("#save").click(function () {

		// Validate

		// Save
		$("#reqType").val("save");
		$("#author").val(getCookie('user'));
		$("#savingMessage").show();

		$.post("./php/create.php", $("#createPostForm").serialize())
		.success(function (data) {

			console.log(data);
			$("#id").val(data.id);
			getPosts();
			setTimeout(function () {
				$("#savingMessage").hide();
			}, 2000);

		})
		.fail(function (statusCode, XMLHttpRequest) {

			console.log(statusCode);
			console.log(XMLHttpRequest);
			console.log("Failed to save properly.");

		});

	});

	// Post request lock
	$("#lock").click(function () {

		// Ask if the user is ceratain

		// Validate

		// Lock

	});

});

function getPosts () {

	// Request all posts
	$.post("./php/auth.php", { "req" : "allPosts"})
	.success(function (data) {

		if (data.posts) {

			$("#posts ul").empty();

			_.each(data.posts, function (post) {

				// Add to posts
				if (!postsMap[post.id]) {
					postsMap[post.id] = post;
				}

				if (post.title.length > 45) {
					post.title = post.title.slice(0, 45) + " . . .";
				}
				var template = _.template($("#postSidebar").html());
				$("#posts ul").append(template(post));

			});

			registerPostHandlers();

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

}

function showEditor() {
	$("#editInterface").show();
	$("#createPostBtn").hide();
	$("#savingMessage").hide();
	$("#title").val("");
	$("#subtitle").val("");
	$("#body").text("");
	$("#id").val("");
	editorOpen = true;
}

function hideEditor() {
	$("#editInterface").hide();
	$("#createPostBtn").show();
	editorOpen = false;
}

function registerPostHandlers() {

	$(".post").click(function () {

		var temp = postsMap[$(this).attr("data-id")];
		showEditor();
		$("#title").val(temp.title);
		$("#subtitle").val(temp.subtitle);
		$("#body").text(temp.body);
		$("#id").val(temp.id);

	});

}

function getCookie(key) {

	var c = document.cookie.split(';');

	var index;
	for (var i = 0, l = c.length; i < l; i++) {
		if (c[i].indexOf(key) >= 0) {
			index = i;
			break;
		}
	}

	return c[index].split('=')[1];

}