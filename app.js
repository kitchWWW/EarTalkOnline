
var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs")
port = process.env.PORT || 3000;

var formidable = require('formidable');

const runSpawn = require('child_process').spawn;

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

fs.writeFile("server.log", "Starting Log...", function(err) {});

function serverLog(data) {
  console.log("***" + Date.now() + " " + data);
}



var server = http.createServer(function(request, response) {
  serverLog(request.method);
  serverLog(request.url);
  if (request.method === "GET") {
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    serverLog(query.id);

    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, {
          "Content-Type": "text/plain"
        });
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if (err) {
          response.writeHead(500, {
            "Content-Type": "text/plain"
          });
          response.write(err + "\n");
          response.end();
          return;
        }
        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  }

  if (request.method === "POST") {

    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    serverLog(query.id);


    if (request.url.startsWith("/updateScore")) {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if (requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {
            'Content-Type': 'text/html'
          });
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        // should probably do something to make sure this is an atomic function.
        var data = JSON.parse(requestBody);
        console.log(data);
        let rawdata = fs.readFileSync('score.json');
        let scoreJson = JSON.parse(rawdata);
        Object.keys(data.params_for_edit).forEach((name)=>{
          console.log(name);
          console.log(data.params_for_edit[name]);
          if(typeof data.params_for_edit[name] == 'number')
          scoreJson[data.sample_id][name] = data.params_for_edit[name];
        });
        console.log(scoreJson);
        let data_to_write = JSON.stringify(scoreJson);
        fs.writeFileSync('score.json', data_to_write);
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
        response.write(data_to_write);
        response.end();
      });

    } else {
      response.writeHead(404, 'Resource Not Found', {
        'Content-Type': 'text/html'
      });
      response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    }
  }

})
server.listen(parseInt(port, 10));
server.on('error', function(e) {
  // Handle your error here
  console.log(e);
});
server.timeout = 1000;

console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");