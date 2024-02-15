const exp = require('express');
const bodyParser = require('body-parser');
const ws = require('ws');
const fs = require('fs');
const {connectionManager} = require('./tools.ts');
const http = require('http');


let conManager = new connectionManager();

//---- initializations
const app = exp();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const wsk = new ws.Server({ server : server });



app.post('/handshake', (req, res) => {

  //TODO: implement code to read startup json file and create tehe ui componenets
  const websocketUrl = `ws://${req.headers.host}`;
  let rec_data = req.body;
  let sockID = 12 //conManager.connectionPool.size

  //TODO: DB Process - save socketID in respective user doc 
  res.json({ webUri: websocketUrl, socketid : sockID });

});

//TODO: socket object key assignment and usage
wsk.on('connection', (socket) => {
  
  
  console.log('WebSocket connected');

  //object to be sent to the socket
  let send_pack = {
    'type': NaN, // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
    'content': NaN, 
  }

  socket.on('message', (message) => {
      
    message = JSON.parse(message);
      if (message['type'] == 'init') {
        console.log('init message received');
        conManager.addConnection(Number(message['uid']) , socket);}


      //TODO: just to test the connection
      console.log(`received: ${typeof(message)}`);
    console.log(`comManager: ${conManager.connectionPool.keys()}`);
      socket.send(JSON.stringify(send_pack));
  });

  


});



server.listen(8009, () => {
  console.log('listening on port 8009');
});