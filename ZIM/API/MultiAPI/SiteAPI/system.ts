const exp = require('express');
const bodyParser = require('body-parser');
const ws = require('ws');
const fs = require('fs');
const {connectManager, MongoTools , EventManager, SessionManager } = require('./tools.ts');
const http = require('http');
const axios = require('axios');



let conManager = new connectManager();
let mongo = new MongoTools('admin', 'pass');
let EventHandler = new EventManager();
let sessionManager = new SessionManager();

//---- initializations
const app = exp();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const wsk = new ws.Server({ server : server });


// ----SITE API---

app.get('/sendInputs', async (req, res) => {
  //i must pass this 2 only with query or whatevr
  let uid = req.query.uid;
  let data = req.query.data;

  
  let sid = sessionManager.getSession(Number(uid));
  //this has the data entered by user via web interfaec
  await mongo.storeInput(uid, sid, data);
  //-- calling the input settings sender
  let send_pack = {
    'type': 'data', // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
    'file_name' : `inputs_${uid}_${sid}`, 
    'uid' : uid,
    'sid' : sid,
    'content': await mongo.getInputs(uid, sid),
  }
  let socket = conManager.getSocket(Number(uid));
  socket.send(JSON.stringify(send_pack));
  //waitng till output gets writtn to mongo
  await EventHandler.getEvent(uid, sid).waiting;

  //TODO: this will load the output ui with recieved outputs -- uncomment this after TEST

  // const response = await axios.post('http://another-api-endpoint.com/profile', {
  //     // Your JSON data here
  //     uid: uid,
  //     sid: sid,
  //     content : await mongo.getOutput(uid, sid)
  //   });
    sessionManager.nextSession(Number(uid)); // this will increment the session number
    //--here i must update the sid in event manager cevent
    res.json({"status": "successFully event demolished"});

  

  
})




//----SITE to MODEL interface------

app.post('/handshake', (req, res) => {

  //TODO: implement code to read startup json file and create tehe ui componenets
  const websocketUrl = `ws://${req.headers.host}`;
  let rec_data = req.body;
  let sockID = 12 //conManager.connectionPool.size

  //--Creating an event for the user
  


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

  socket.on('message', async (message) => {
      
    message = JSON.parse(message);
      if (message['type'] == 'calib') {
        console.log(`calib message received with uid: ${message['uid']}`);
        conManager.addConnection(Number(message['uid']) , socket);
        sessionManager.setSession(Number(message['uid']))
        
        //TODO: here i have to store message['content'] in mongoDB, this is startup.json
        //register my custom event
        EventHandler.on(message['uid'], sessionManager.getSession(Number(message['uid'])));
      }
      else if (message['type'] == 'data') {
          if (sessionManager.getSession(Number(message['uid'])) != 1) {
            EventHandler.on(message['uid'], sessionManager.getSession(Number(message['uid'])));
          }

          await mongo.storeOutput(message['uid'], sessionManager.getSession(Number(message['uid'])), message['content']);
          //TODO: here i will have to call a custom event that will resolve await in SendInput endpoiint hold and send the response

          //now releasing the response thread
          EventHandler.emit(message['uid'], sessionManager.getSession(Number(message['uid'])));
        }


      // //TODO: just to test the connection
      // console.log(`received: ${typeof(message)}`);
      // console.log(`comManager: ${conManager.getSocketId(Number(message['uid']))}`);
      // send_pack['type'] = 'calib';
      // socket.send(JSON.stringify(send_pack));
  });

  


});



server.listen(8009, () => {
  console.log('listening on port 8009');
});