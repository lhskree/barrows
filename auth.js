$(document).ready(function () {

	$.post("./init.php")
	.success(function (data) {
		if (!data.userExists) {
			$("#outlet").append(data.form);
		}
	});

});