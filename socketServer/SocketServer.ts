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


  app.get('/terminateSim', async (req : any , res : any) => {
    let uid = req.query.uid;
    await mongo.terminateSim(Number(uid));
  })

  app.get('createuser' , async (req : any, res : any)=> {
    let uname = req.query.uname;
    let pass = req.query.pass;
    let resp = await mongo.createUser(uname,pass);
    res.json({"uid":resp.uid});
  })
  
  app.get('/sendSubReqs', async (req : any,res : any) => {
    //i must pass this 2 only with query or whatevr
    
    let uid = req.query.uid;
    let option = req.query.option;

    let formData;
    let category;
    let compname;
        
    if (req.query.formData) {
            const formDataParam = req.query.formData;
            formData = JSON.parse(decodeURIComponent(formDataParam));
    }
    if (req.query.cat) {
      category = req.query.cat;
    }
    if (req.query.compname) {
      compname = req.query.compname;
    }

    let ifActiveSim = await mongo.findActiveSim(Number(uid));
    let sid = Number(sessionManager.getSession(Number(uid))) - 1;
  
    let send_pack = {
      'type': 'subreq', // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
      'uid' : uid,
      'sid' : sid,
      'func': option,//await mongo.getSubReq(uid, sid),
      'formData' : formData,
      'category' : category,
      'compname' : compname,
    }

    if (option == "overview") {
      //TODO: here the retrieval of mongo
      let send_data = await mongo.getOutput(Number(uid), Number(ifActiveSim) , Number(sid));
      console.log(send_data);
      res.json({"data" : send_data});

    }
    else {

    let socket = conManager.getSocket(Number(uid));
    socket.send(JSON.stringify(send_pack));
    //waitng till output gets writtn to mongo
    await EventHandler.getEvent(uid, String(sid)).get(option).waiting;
    
    EventHandler.getEvent(uid, String(sid)).get(option).reset();
    console.log("event reset")

    let sendData = await mongo.getsuboutputs(Number(uid), Number(sid),option);
    console.log("subout data: ", sendData);
    res.json({"data" : sendData});

    }


  })


  app.get('/getui', async (req : any, res : any) => {
    let uid = req.query.uid;
    
    let results = await mongo.getUI(Number(uid));
    res.json({"data": results});
  });

  app.get('/sendInputs', async (req : any, res : any) => {
    //i must pass this 2 only with query or whatevr
    let uid = req.query.uid;
    console.log("user here is" , uid);
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
    console.log("sent the inputs via socket and next toggle event waiting....")
    //waitng till output gets writtn to mongo
    await EventHandler.getEvent(uid, String(sid)).get('input').waiting;
  
    await mongo.createNextSession(Number(uid) , Number(ifActiveSim), Number(sessionManager.getSession(Number(uid))));
    
    
    
    //TODO: refiretc krpn 
  
    // const response = await axios.post('http://another-api-endpoint.com/profile', {
    //     // Your JSON data here
    //     uid: uid,
    //     sid: sid,
    //     content : await mongo.getOutput(uid, sid)
    //   });
    // sessionManager.nextSession(Number(uid)); // this will increment the session number
    // EventHandler.on(uid, String(sessionManager.getSession(Number(uid))));
      //--here i must update the sid in event manager cevent
      res.json({"status": "successFully event demolished"});
  
    
  })






  
  app.get('/createSim', async (req : any, res : any) => {
    let uid = req.query.uid;
    
    if(!sessionManager.getSession(Number(uid))) {
      sessionManager.setSession(Number(uid));
      console.log("session set via create Sim")
    }
    
    if (!EventHandler.checkEvent(Number(uid) , Number(sessionManager.getSession(Number(uid))))) {
      EventHandler.on(uid, String(sessionManager.getSession(Number(uid))));
      console.log("Event set via create sim")
    }

    
    
    let ifActiveSim = await mongo.findActiveSim(Number(uid));
    if (ifActiveSim != null) {
        res.json({"status": "sim already exists"});
        return;
        //redirect to the input page as there is hte new simulation already
    } else {
      ifActiveSim = await mongo.createEmptySim(Number(uid));
        //here it create an empty simulation block 
    //let results = await mongo.createSim(Number(uid), Number(simID));
    
    // NOW SHOWING a loading icon on the webui
    await EventHandler.getEvent(uid, String(sessionManager.getSession(Number(uid)))).get('ui').waiting;
    //[ then ]send the ui to the webui , redirect to the input ui
    }


 
    

    res.json({"status": "good", "simID" : ifActiveSim});
    //TODO: here this sim must be stored in the session
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
        let user_id = message['uid'];
        //Message Type : Calib
        if (message['type'] == 'calib') {
          console.log(`calib message received with uid: ${user_id}`);
          conManager.addConnection(Number(user_id) , socket);

          //TODO: here i have moved these to /createSim endpoint
        //   sessionManager.setSession(Number(message['uid']));
        //   EventHandler.on(message['uid'], String(sessionManager.getSession(Number(message['uid']))));

        if(!sessionManager.getSession(Number(user_id))) {
          sessionManager.setSession(Number(user_id));
          console.log("session set via initial socket")
        }

        if (!EventHandler.checkEvent(Number(user_id) , Number(sessionManager.getSession(Number(user_id))))) {
          EventHandler.on(user_id, String(sessionManager.getSession(Number(user_id))));
          console.log("event set via initial socket")
        }

        let ifActSim = await mongo.findActiveSim(Number(user_id));
        if (ifActSim != null) {
          await mongo.storeUI(Number(user_id), Number(ifActSim), message['content']);
          EventHandler.emit(message['uid'], String(sessionManager.getSession(Number(user_id))), "ui");
        } else {
          let createdSim = await mongo.createEmptySim(Number(user_id));
          await mongo.storeUI(Number(user_id), Number(createdSim), message['content']);
          EventHandler.emit(user_id, String(sessionManager.getSession(Number(user_id))), "ui");
          
        }
          
        }
        //Message Type : Data
        else if (message['type'] == 'data') {
          console.log(`data message received with uid: ${user_id}`);
            // if (sessionManager.getSession(Number(user_id)) != 1) {
            //   EventHandler.on(user_id, String(sessionManager.getSession(Number(user_id))));
            // }
            let ifActSim = await mongo.findActiveSim(Number(user_id));
            // This is the Overview
            await mongo.storeOutput(Number(user_id), Number(ifActSim), Number(sessionManager.getSession(Number(user_id))), message['content'], "overview");
            //TODO: here i will have to call a custom event that will resolve await in SendInput endpoiint hold and send the response
  
            //now releasing the response thread
            EventHandler.emit(user_id, String(sessionManager.getSession(Number(user_id))), "input");
            sessionManager.nextSession(Number(user_id)); // this will increment the session number
            EventHandler.on(user_id, String(sessionManager.getSession(Number(user_id))));
          } 
          else if (message['type'] == 'subreq') { 
            let ifActSim = await mongo.findActiveSim(Number(user_id));

            await mongo.storeOutput(Number(user_id), Number(ifActSim), Number(message['sid']), message['content'], message['func']);
            console.log("message : ", message['content']);

            EventHandler.emit(user_id, String(message['sid']), message['func']);
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





