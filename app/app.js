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

fs.writeFile("server.log", "Starting Log...\n", function(err) {});

function serverLog(data) {
  console.log("***" + Date.now() + " " + data);
}


function writeToHistory(user, sample, action) {
  if (user) {
    var bits = user.split("=|=|=|=|=");
  } else {
    bits = ['', 'Anon'];
  }
  var actionLog = '***' + Date.now() + ' - ' + bits[1] + " " + action + " " + sample + "\n";
  console.log(actionLog);
  fs.appendFile("server.log", actionLog, function(err) {});
}


function writeToChat(user,chat_text) {
  if (user) {
    var bits = user.split("=|=|=|=|=");
  } else {
    bits = ['', 'Anon'];
  }
  var chatLog = Date.now() + ' - ' + bits[1] + ": " + chat_text + "\n";
  console.log(chatLog);
  console.log("***" + Date.now() + " " + data);
  fs.appendFile("chat.log", chatLog, function(err) {});
}


function stripName(id) {
  if (id) {
    return id.split("=|=|=|=|=")[0];
  }
  return "none";
}


function getName(id) {
  if (id) {
    return id.split("=|=|=|=|=")[1];
  }
  return "Anon";
}

//copy the $file to $dir2
var copyFile = (file, dir2, new_name, callbackFunc) => {
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, new_name));

  source.pipe(dest);
  source.on('end', function() {
    console.log('Succesfully copied');
    callbackFunc();
  });
  source.on('error', function(err) {
    console.log(err);
  });
};



var server = http.createServer(function(request, response) {
  serverLog(request.method);
  serverLog(request.url);
  if (request.method === "GET") {
    if (request.url.startsWith("/listAllScores")) {
      console.log('wowo hi');
      // parse a file upload
      //requiring path and fs modules
      //joining path of directory 
      //passsing directoryPath and callback function
      const directoryPath = path.join(__dirname, 'old_scores');
      const files_names = [];
      fs.readdir(directoryPath, function(err, files) {
        //handling error
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function(file) {
          // Do whatever you want to do with the file
          console.log(file);
          files_names.push(file);
        });
        response.writeHead(200, {
          'content-type': 'text/plain'
        });
        response.write(JSON.stringify(files_names));
        response.end();
      });
    }

    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    serverLog(stripName(query.id));

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
    serverLog(stripName(query.id));
    if (request.url.startsWith("/firstPing")) {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if (requestBody.length > 1e20) {
          response.writeHead(413, 'Request Entity Too Large', {
            'Content-Type': 'text/html'
          });
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        var data = JSON.parse(requestBody);
        console.log(data);
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
        roles = ['distort', 'lowpass', 'volume', 'pan']
        data_to_write = JSON.stringify({
          role: roles[Math.floor(Math.random() * roles.length)]
        });
        response.write(data_to_write);
        response.end();
      });

    } else if (request.url.startsWith("/updateScore")) {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if (requestBody.length > 1e20) {
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
        Object.keys(data.params_for_edit).forEach((name) => {
          console.log(name);
          console.log(data.params_for_edit[name]);
          if (typeof data.params_for_edit[name] == 'number') {
            scoreJson[data.sample_id][name] = data.params_for_edit[name];
          }
        });
        if (Object.keys(data.params_for_edit).length < 1) {
          delete scoreJson[data.sample_id];
          writeToHistory(query.id, data.sample_id, 'deleted');
        } else {
          writeToHistory(query.id, data.sample_id, 'moved');
        }
        console.log(scoreJson);
        let data_to_write = JSON.stringify(scoreJson);
        fs.writeFileSync('score.json', data_to_write);
        fs.writeFileSync('old_scores/score_' + Date.now() + '.json', data_to_write);
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
        response.write(data_to_write);
        response.end();
      });

    } else if (request.url.startsWith("/eartalkUpload")) {
      // parse a file upload
      var form = new formidable.IncomingForm();
      form.maxFileSize = 200 * 1024 * 1024; // 200mb max file size. Thing says 100, so we give people some buffer.
      form.parse(request, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        console.log(err);

        // figure out what sample number it should be
        fs.readdir('samples', (err, files_in_folder) => {
          var howMany = files_in_folder.length;
          var name_to_use = files['upload'].name;
          if (name_to_use == 'blob') {
            name_to_use = getName(query.id);
          }
          var new_sample_id = 's' + howMany + '_' + name_to_use;
          copyFile(files['upload'].path, 'samples', new_sample_id, () => {
            console.log("wow ok something new here too");

            let rawdata = fs.readFileSync('score.json');
            let scoreJson = JSON.parse(rawdata);
            scoreJson[new_sample_id] = {
              "startTime": 0,
              "volume": Math.random(),
              "pan": Math.random(),
              "distort": Math.random(),
              "lowpass": Math.random(),
            }
            console.log(scoreJson);
            let data_to_write = JSON.stringify(scoreJson);
            fs.writeFileSync('score.json', data_to_write);
            writeToHistory(query.id, new_sample_id, 'uploaded');
          })
          response.writeHead(200, {
            'content-type': 'text/plain'
          });
          response.write(new_sample_id);
          response.end();
        });
      });
    } else if (request.url.startsWith("/handsUpload")) {
      // parse a file upload
      var form = new formidable.IncomingForm();
      form.parse(request, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        console.log(err);

        // figure out what sample number it should be
        fs.readdir('hands/samples', (err, files_in_folder) => {
          var howMany = files_in_folder.length;
          var name_to_use = files['upload'].name;
          if (name_to_use == 'blob') {
            name_to_use = getName(query.id);
          }
          var new_sample_id = 's' + howMany + '_' + name_to_use + '.wav';
          copyFile(files['upload'].path, 'hands/samples', new_sample_id, () => {
            console.log("wow ok something new here too");
          })
          response.writeHead(200, {
            'content-type': 'text/plain'
          });
          response.write(new_sample_id);
          response.end();
        });
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