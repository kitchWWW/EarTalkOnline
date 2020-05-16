document.getElementById("cname")
	.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			document.getElementById("go_all").click();
		}
	});


function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function showAll() {
	console.log("whooo");

	var params = {
		master: getUrlVars()['master'],
		name: document.getElementById("cname").value,
		timeOffset: 0,
	};

	var esc = encodeURIComponent;
	var query = Object.keys(params)
		.map(function(k) {
			return esc(k) + '=' + esc(params[k]);
		})
		.join('&');
	console.log(query)
	window.location.href = "go.html?"+query;
}