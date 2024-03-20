const express = require('express');
const { createServer } = require('http');
const { Server } = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const {conManager, EventHandler, sessionManager} = require('./tools');
const {mongo} = require('./db');



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const server = createServer(app);
const wsk = new Server({ server });

  
  app.get('/sendSubReqs', async (req : any,res : any) => {
    //i must pass this 2 only with query or whatevr
    let uid = req.query.uid;
    let data = req.query.data;
  
    let sid = sessionManager.getSession(Number(uid));
    
    //TODO: wether store in mongo or not
    //await mongo.storeSubReq(uid, sid, data);
    //calling the input settings sender
    let send_pack = {
      'type': 'data', // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
      'file_name' : `subreqs_${uid}_${sid}`, 
      'uid' : uid,
      'sid' : sid,
      'content': null,//await mongo.getSubReq(uid, sid),
    }
    let socket = conManager.getSocket(Number(uid));
    socket.send(JSON.stringify(send_pack));
    //waitng till output gets writtn to mongo
    await EventHandler.getEvent(uid, String(sid) ).waiting;
  })


  app.get('/getui', async (req : any, res : any) => {
    let uid = req.query.uid;
    let simID = req.query.simID;
    let results = await mongo.getUI(Number(uid), Number(simID));
    res.json({"data": results});
  });

  app.get('/sendInputs', async (req : any, res : any) => {
    //i must pass this 2 only with query or whatevr
    let uid = req.query.uid;
    let data = req.query.data;
    let ifActiveSim = await mongo.findActiveSim(Number(uid));
    
    let sid = sessionManager.getSession(Number(uid))?.toString();
    //this has the data entered by user via web interfaec
    await mongo.storeInput(Number(uid), Number(ifActiveSim), Number(sid) , data);
    //-- calling the input settings sender
    let send_pack = {
      'type': 'data', // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
      'file_name' : `inputs_${uid}_${sid}`, 
      'uid' : uid,
      'sid' : sid,
      'content': data ,
    }
    let socket = conManager.getSocket(Number(uid));
    socket.send(JSON.stringify(send_pack));
    //waitng till output gets writtn to mongo
    await EventHandler.getEvent(uid, String(sid)).get('input').waiting;
  
    //TODO: this will load the output ui with recieved outputs -- uncomment this after TEST
  
    // const response = await axios.post('http://another-api-endpoint.com/profile', {
    //     // Your JSON data here
    //     uid: uid,
    //     sid: sid,
    //     content : await mongo.getOutput(uid, sid)
    //   });
    sessionManager.nextSession(Number(uid)); // this will increment the session number
    await mongo.createNextSession(Number(uid) , Number(ifActiveSim), Number(sessionManager.getSession(Number(uid))));
      //--here i must update the sid in event manager cevent
      res.json({"status": "successFully event demolished"});
  
    
  })

  app.get('/createSim', async (req : any, res : any) => {
    let uid = req.query.uid;
    
    sessionManager.setSession(Number(uid));
    EventHandler.on(uid, String(sessionManager.getSession(Number(uid))));
    
    let ifActiveSim = await mongo.findActiveSim(Number(uid));
    if (ifActiveSim != null) {
        res.json({"status": "sim already exists"});
        return;
        //redirect to the input page as there is hte new simulation already
    } else {
      await mongo.createEmptySim(Number(uid));
        //here it create an empty simulation block 
    //let results = await mongo.createSim(Number(uid), Number(simID));
    
    // NOW SHOWING a loading icon on the webui
    await EventHandler.getEvent(uid, String(sessionManager.getSession(Number(uid)))).get('ui').waiting;
    //[ then ]send the ui to the webui , redirect to the input ui
    }
 
    

    res.json({"status": "good"});
  });


  app.post('/handshake', (req : any, res : any) => {

    //TODO: implement code to read startup json file and create tehe ui componenets
    const websocketUrl = `ws://${req.headers.host}`;
    let rec_data = req.body;
    let sockID = 1 //conManager.connectionPool.size
  
    //--Creating an event for the user
    
    //TODO: DB Process - save socketID in respective user doc 
    res.json({ webUri: websocketUrl, socketid : sockID });
  
  });
  
  // WebSocket setup here, similar to what you have in your route.ts
  wsk.on('connection', (socket : any) => {
    // Your connection logic
    console.log('WebSocket connected');
    //object to be sent to the socket
    let send_pack = {
      'type': NaN, // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
      'content': NaN, 
    }
  
    socket.on('message', async (message : any) => {
        
        message = JSON.parse(message);

        //Message Type : Calib
        if (message['type'] == 'calib') {
          console.log(`calib message received with uid: ${message['uid']}`);
          conManager.addConnection(Number(message['uid']) , socket);

          //TODO: here i have moved these to /createSim endpoint
        //   sessionManager.setSession(Number(message['uid']));
        //   EventHandler.on(message['uid'], String(sessionManager.getSession(Number(message['uid']))));

        let ifActSim = await mongo.findActiveSim(Number(message['uid']));
        if (ifActSim != null) {
          await mongo.storeUI(Number(message['uid']), Number(ifActSim), message['content']);
          EventHandler.emit(message['uid'], String(sessionManager.getSession(Number(message['uid']))), "ui");
        } else {
          let createdSim = await mongo.createEmptySim(Number(message['uid']));
          await mongo.storeUI(Number(message['uid']), Number(createdSim), message['content']);
          EventHandler.emit(message['uid'], String(sessionManager.getSession(Number(message['uid']))), "ui");
          
        }
          
        }
        //Message Type : Data
        else if (message['type'] == 'data') {
          console.log(`data message received with uid: ${message['uid']}`);
            if (sessionManager.getSession(Number(message['uid'])) != 1) {
              EventHandler.on(message['uid'], String(sessionManager.getSession(Number(message['uid']))));
            }
            let ifActSim = await mongo.findActiveSim(Number(message['uid']));
            // This is the Overview
            await mongo.storeOutput(message['uid'], String(ifActSim), String(sessionManager.getSession(Number(message['uid']))), message['content']);
            //TODO: here i will have to call a custom event that will resolve await in SendInput endpoiint hold and send the response
  
            //now releasing the response thread
            EventHandler.emit(message['uid'], String(sessionManager.getSession(Number(message['uid']))), "input");
          }
  
  
        // //TODO: just to test the connection
        // console.log(`received: ${typeof(message)}`);
        // console.log(`comManager: ${conManager.getSocketId(Number(message['uid']))}`);
        // send_pack['type'] = 'calib';
        // socket.send(JSON.stringify(send_pack));
    });
  
    
  });

  let port = 3005;
  server.listen(port, ( err : any ) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });





