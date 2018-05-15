/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var resultObj = {};
resultObj.results = [];

const fs = require('fs');


exports.requestHandler = function(request, response) {
  
  
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;

  // The outgoing status.

  // See the note below about CORS headers.
  
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.  
  headers['Content-Type'] = 'text/plain';
  
  var files = {
    styles: 'styles/styles.css',
    jquery: 'bower_components/jquery/dist/jquery.js',
    underscore: 'bower_components/underscore/underscore.js',
    app: 'scripts/app.js',
    main: 'scripts/main.js' 
  };
  var file; 
  
  if (request.url.includes(files.styles)) {
    file = files.styles;
  } else if (request.url.includes(files.jquery)) {
    file = files.jquery;
  } else if (request.url.includes(files.underscore)) {
    file = files.underscore;
  } else if (request.url.includes(files.app)) {
    file = files.app;
  } else if (request.url.includes(files.main)) {
    file = files.main;
  } 
  
  if (request.url.includes('/test')) {
    headers['Content-Type'] = 'text/html';
    response.writeHead(200, headers);
    response.end('<html><head><title>Post Example</title></head>');
  } else if (request.url === '/' || request.url.includes('username')) {
    console.log('yes');
    headers['Content-Type'] = 'text/html';
    response.writeHead(200, headers);
    
    fs.readFile('../client/index.html', function (err, data) {
      if (err) { return console.error(err); }
      var postHTML = data.toString();
      response.end(postHTML);
    });
  } else if (file) {
    if (file === 'styles/styles.css') {
      headers['Content-Type'] = 'text/css';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    response.writeHead(200, headers);
    fs.readFile('../client/' + file, function (err, data) {
      if (err) { return console.error(err); }
      var postHTML = data.toString();
      response.end(postHTML);
    });
  } else if (request.url.includes('/classes/messages')) {
    
    if (request.method === 'GET') {
      response.writeHead(200, headers); 
      response.end(JSON.stringify(resultObj));  
    } else if (request.method === 'POST') {
      
      let body = [];
      request.on('error', (err) => {
        console.error(err);

        response.writeHead(500, headers); 
        response.end(JSON.stringify(resultObj));

      }).on('data', (chunk) => {

        body.push(chunk);

      }).on('end', () => {

        body = JSON.parse(Buffer.concat(body).toString()); 


        response.writeHead(201, headers);

        body.createdAt = request.timeStamp;
        resultObj.results.push(body);
        
        response.end(JSON.stringify(resultObj));
      });

    } else if (request.method === 'OPTIONS') {

      response.writeHead(200, headers);
      response.end();  
    }
  } else {
    response.writeHead(404, headers); 
    console.log('bad stuff: ', request.url);
    response.end();
  }
  
  //{"Allow": 'GET, POST, PUT, DELETE, OPTIONS'}

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


