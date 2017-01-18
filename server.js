var http = require('http');

/****
## Server config & housekeeping
****/
app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/health', function(req, res){
    res.send('OK');
});

app.get("/api/users", function (req, res) {
  res.set("Content-Type", "application/json");
  res.send({ name: "Jane", isValid: true, group: "Admin" });
});



http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');

}).listen(process.env.PORT || 8080);
