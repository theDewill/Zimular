const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('ws');
const bodyParser = require('body-parser');

//const { connectManager, MongoTools , EventManager, SessionManager } = require ('./tools');
const { MongoClient, ServerApiVersion }  = require('mongodb');



//-----SOCKET MODEL----ß
// connectionpool socket object structure
// {
//     'socketid' : 12,
//     'socket': socket
class connectManager {

    public connectionPool : Map<number, any>;

    constructor()  {
        this.connectionPool = new Map();
    }
    addConnection(uid : number , socket : any) {

        let socketData = {
            'socketid' : this.connectionPool.size,
            'socket' : socket
        }
        this.connectionPool.set(uid, socketData);
    }

    getSocket(uid : number) {
        return this.connectionPool.get(uid)['socket'];
    }

    getSocketId(uid : number) {
        return this.connectionPool.get(uid)['socketid'];
    }

}
//TODO: temporary remove this
class SessionManager {
    public sessionPool : Map<number, number>;

    constructor()  {
        this.sessionPool = new Map();
    }

    setSession(uid : number) {
        this.sessionPool.set(uid, 1);
    }

    getSession(uid : number) {
        return this.sessionPool.get(uid);
    }

    nextSession(uid : number) {
        let session : any  = this.sessionPool.get(uid);
        this.sessionPool.set(uid, Number(session)+1);
    }

  
}

class CEvent {
    uid : string;
    sid : string;
    changeState: ((value: string) => void) | undefined;
    rejectPromise: ((reason?: any) => void) | undefined;
    waiting: Promise<any>;
    constructor(uid : string, sid : string) {
        this.uid = uid;
        this.sid = sid;
        this.waiting = new Promise((res,rej)=> {
            this.changeState = res;
            this.rejectPromise = rej;
        });
    }

    done () {
        if (this.changeState) {
            this.changeState("done");
        } else {
            console.error('changeState is not defined');
        }
    }

    reject (reason : any) {
        if (this.rejectPromise) {
            this.rejectPromise(reason);
        } else {
            console.error('rejectPromise is not defined');
        }
    }
}


class EventManager {

    eventPool : Map<number,any>;

    constructor() {
        this.eventPool = new Map();
    }

    closeEvent(uid : string , sid : string) {
        let tempEvnt = this.eventPool.get(Number(uid));
        tempEvnt.delete(Number(sid));
    }

    on(uid : string , sid : string,) {
        let event = new CEvent(uid, sid);
        let Event : Map<any,any> = new Map(); 
        Event.set(Number(sid), event);
        this.eventPool.set(Number(uid) , Event);
    }

    getEvent(uid : string, sid : string) {
        return this.eventPool.get(Number(uid)).get(Number(sid));
    }



    emit (uid : string , sid : string) {
        let event = this.eventPool.get(Number(uid)).get(Number(sid));
        event.done();
    }

    cancel (uid : string , sid : string) {
        let event = this.eventPool.get(Number(uid)).get(Number(sid));
        event.reject("cancelled");
    }
}

class MongoTools {

    public Mongo;
    public url;
    constructor(usrnm : string, pass : string)  {
        this.url = `mongodb://${usrnm}:${pass}@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0`;
        this.Mongo = new MongoClient(this.url,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    async test_conct() {
        await this.Mongo.connect();
        await this.Mongo.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await this.Mongo.close();
    }

    async connect() {
            await this.Mongo.connect();
            await this.Mongo.db("admin").command({ ping: 1 });
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    async disconnect() {
        await this.Mongo.close();
    }

    async getInputs (u_id : string, s_id : string) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const result = await col.findOne(query);
        let session = `session_${s_id}`;
        return result.data[session].input;
    }

    async getUI (u_id : number, simID : number) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: u_id };
        const result = await col.findOne(query);
        return result.simulations[String(simID)].ui;
    }

    async storeUI (uid : number, simID : number, sesID : number, data : any) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const qry = {uid : Number(uid)};
        const options = { upsert: true };
        let updateDoc :any = { $set: {} };
        updateDoc.$set[`simulations.${simID}.ui`] = data;
        await col.updateOne(qry, updateDoc, options);
        console.log(`upated structure data for session - ${sesID} to mongo`)
    }

    async storeInput(u_id : string, s_id : string , data : any) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const options = { upsert: true };
        let session = `session_${s_id}`;
        let updateDoc :any = { $set: {} };
        updateDoc.$set[`data.${session}.input`] = data;
        await col.updateOne(query, updateDoc, options);
        console.log(`upated input data for session - ${s_id} to mongo`)
    }

    async storeOutput (u_id : string, s_id : string, outputData : any) { // here output has the read and recived json from fmk model
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const options = { upsert: true };
        let session = `session_${s_id}`;
        let updateDoc :any  = { $set: {} };
        updateDoc.$set[`data.${session}.output`] = outputData;
        console.log(`upated output data for session - ${s_id} to mongo`)


// Now, use updateDoc in your update operation

        const updated = await col.updateOne(query, updateDoc, options);
    }

    async getOutput (u_id : string, s_id : string) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const result = await col.findOne(query);
        let session = `session_${s_id}`;
        return result.data[session].output;
    }


}

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {

    console.log("done preparing.... next app");

  const app = express();
  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  const server = createServer(app);
  const wsk = new Server({ server });

  let conManager = new connectManager();
let mongo = new MongoTools('admin', 'pass');
let EventHandler = new EventManager();
let sessionManager = new SessionManager();


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
    let results = await mongo.getUI(1, 1);
    res.json({"data": results});
  });

  app.get('/sendInputs', async (req : any, res : any) => {
    //i must pass this 2 only with query or whatevr
    let uid = req.query.uid;
    let data = req.query.data;
  
    
    let sid = sessionManager.getSession(Number(uid))?.toString();
    //this has the data entered by user via web interfaec
    await mongo.storeInput(uid, String(sid) , data);
    //-- calling the input settings sender
    let send_pack = {
      'type': 'data', // here 1) calib - need startup again [model changed or first time]  2) data - normal transmission input output
      'file_name' : `inputs_${uid}_${sid}`, 
      'uid' : uid,
      'sid' : sid,
      'content': await mongo.getInputs(uid, String(sid)),
    }
    let socket = conManager.getSocket(Number(uid));
    socket.send(JSON.stringify(send_pack));
    //waitng till output gets writtn to mongo
    await EventHandler.getEvent(uid, String(sid)).waiting;
  
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
        if (message['type'] == 'calib') {
          console.log(`calib message received with uid: ${message['uid']}`);
          conManager.addConnection(Number(message['uid']) , socket);
          sessionManager.setSession(Number(message['uid']))

          //-------- temp ----------
          await mongo.storeUI(Number(message['uid']), 1, 1, message['content']);
          
          let sock = conManager.getSocket(Number(message['uid']));
          sock.send(JSON.stringify({"type": "calib","msg" : "so here the wave from socket"}));

          
          //TODO: here i have to store message['content'] in mongoDB, this is startup.json
          //register my custom event
          
          EventHandler.on(message['uid'], String(sessionManager.getSession(Number(message['uid']))));
        }
        else if (message['type'] == 'data') {
            if (sessionManager.getSession(Number(message['uid'])) != 1) {
              EventHandler.on(message['uid'], String(sessionManager.getSession(Number(message['uid']))));
            }
          
  
            await mongo.storeOutput(message['uid'], String(sessionManager.getSession(Number(message['uid']))), message['content']);
            //TODO: here i will have to call a custom event that will resolve await in SendInput endpoiint hold and send the response
  
            //now releasing the response thread
            EventHandler.emit(message['uid'], String(sessionManager.getSession(Number(message['uid']))));
          }
  
  
        // //TODO: just to test the connection
        // console.log(`received: ${typeof(message)}`);
        // console.log(`comManager: ${conManager.getSocketId(Number(message['uid']))}`);
        // send_pack['type'] = 'calib';
        // socket.send(JSON.stringify(send_pack));
    });
  
    
  });

  app.all('*', async (req : any, res : any) => {
    return handle(req, res);
  });

  let port = 3004
  server.listen(port, ( err : any ) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });


}); //next end


