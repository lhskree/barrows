var postsMap = {}; // All active posts
var editorOpen = false;

// The formatting codes
var formattingOptions = {
	"strong" : { start : "<strong>", end : "</strong>" },
	"em" : { start : "<em>", end : "</em>" },
	"under" : { start : "<under>", end : "</under>" },
	"through" : { start : "<through>", end : "</through>" },
	"link" : { start : "<link to=>", end : "</link>" },
	"ul" : { start : "<ul>", end : "</ul>" },
	"ol" : { start : "<ol>", end : "</ol>" },
	"code" : { start : "<code>", end : "</code>" },
	"blockquote" : { start : "<blockquote>", end : "</blockquote>" },
	"pre" : { start : "<pre>", end : "</pre>" }
}

$(document).ready(function () {

	// redirect to login
	if (!getCookie('user')) {
		window.location.href = "./login.html";
	}

	$("#noPosts").hide();
	$("#editInterface").hide();
	$("#alertMessage").hide();

	getPosts();

	// Show / hide the editor
	$("#createPostBtn").click(showEditor);

	$("#closeEditor").click(hideEditor);

	// selecting formatting options
	$("#formattingOptions li").click(function (e) {
		e.stopPropagation();
		$("#formattingOptions li").removeClass("selected");
		$(this).addClass("selected");
		addFormatting($(this));
	});

	// deselect formatting options on blur
	$(window).click(function () {
		$("#formattingOptions li").removeClass("selected");
	});

	// Post request save

	$("#save").click(saveDraft);

	// Post request lock
	$("#lock").click(function () {

		// Ask if the user is ceratain

		// Validate
		var valid = true;

		// Lock
		if (!$("#id").val().length) {
			valid = false;
			$("#alertMessage").show();
			$("#alertMessage span").text("Please save a draft before publishing!");
		}

		if (valid) {
			$("#reqType").val("lock");

			$.post("./php/lock.php", $("#createPostForm").serialize())
			.success(function (data) {

				console.log(data);
				postsMap[data.id].draft = "0";
				postsMap[data.id].locked = "1";
				hideEditor();
				getPosts();

			})
			.fail(function () {

				console.log("Encyryption failed.");

			});
		}

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
	$("#lockedOutlet").empty();
	$("#editInterface").show();
	$("#createPostBtn").hide();
	$("#savingMessage").hide();
	$("#title").val("");
	$("#subtitle").val("");
	$("#body").val("");
	$("#id").val("");
	editorOpen = true;
}

function hideEditor() {
	$("#editInterface").hide();
	$("#createPostBtn").show();
	editorOpen = false;
}

function loadDraft(temp) {
	$("#lockedOutlet").empty();
	$("#editInterface").show();
	$("#createPostBtn").hide();
	$("#savingMessage").hide();
	$("#title").val(temp.title);
	$("#subtitle").val(temp.subtitle);
	$("#body").val(temp.body);
	$("#id").val(temp.id);
	editorOpen = true;
}

function registerPostHandlers() {

	$(".auth_post").click(showPost);

}

function showPost() {

	var temp = postsMap[$(this).attr("data-id")];

	// The post is a draft
	if (temp.draft === "1") {
		loadDraft(temp);

	// The post is locked
	} else {

		hideEditor();
		var template = _.template($("#lockedPostTemplate").html());
		$("#lockedOutlet").empty().append(template(temp));

	}

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

	return c[index] ? c[index].split('=')[1] : false;

}

function saveDraft () {

	// Validate

	// Save
	$("#alertMessage").hide();
	$("#reqType").val("save");
	$("#author").val(getCookie('user'));
	$("#savingMessage").show();

	$.post("./php/save.php", $("#createPostForm").serialize())
	.success(function (data) {

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
}

function addFormatting($option) {
	var action = $option.attr("data-formatting-option"),
		$body = $("#body");

	var text = $body.val(),
		start = $body.prop("selectionStart"),
		end = $body.prop("selectionEnd");
	text = text.slice(0, start) + formattingOptions[action].start + text.slice(start, end) + formattingOptions[action].end + text.slice(end);
	$body.val(text);

}