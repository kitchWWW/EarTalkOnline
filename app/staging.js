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


var mode = getUrlVars()['mode'];
console.log(mode)
if(mode=='history'){
	document.getElementById("name_entry").style.display = "none"
	document.getElementById("time_entry").style.display = "block"
}



var TIME_OFFSET = 0;

function showAll() {
	console.log("whooo");

	var params = {
		mode: getUrlVars()['mode'],
		name: document.getElementById("cname").value,
		timeOffset: TIME_OFFSET,
	};

	var esc = encodeURIComponent;
	var query = Object.keys(params)
		.map(function(k) {
			return esc(k) + '=' + esc(params[k]);
		})
		.join('&');
	console.log(query)
	window.location.href = "go.html?" + query;
}

var fp = flatpickr(document.querySelector('#flatpickr'), {
	enableTime: true,
	dateFormat: "Y-m-d H:i",
	altInput: true,
	"disable": [
        function(date) {
            // return true to disable
            return (date.getTime() > Date.now());

        }
    ],
	//mode: "multiple",
	onChange: function(selectedDates, dateStr, instance) {
		var myDate = flatpickr.parseDate(dateStr, "Y-m-d h:i")
		TIME_OFFSET = Date.now() - myDate.getTime()
		console.log('date: ', dateStr);
		console.log(TIME_OFFSET);
	}
});