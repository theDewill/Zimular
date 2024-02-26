const { MongoClient, ServerApiVersion }  = require('mongodb')

//-----SOCKET MODEL----
// connectionpool socket object structure
// {
//     'socketid' : 12,
//     'socket': socket

// }

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
    changeState: (value: string) => void; // This will resolve the promise
    rejectPromise: (reason?: any) => void;
    waiting : Promise<any>;

    constructor(uid : string, sid : string) {
        this.uid = uid;
        this.sid = sid;
        this.waiting = new Promise((res,rej)=> {
            this.changeState = res;
            this.rejectPromise = rej;
        });
    }

    done () {
        this.changeState("done");
    }

    reject (reason : any) {
        this.rejectPromise(reason);
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

    async storeInput(u_id : string, s_id : string) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const options = { upsert: true };
        let session = `session_${s_id}`;
        let updateDoc = { $set: {} };
        updateDoc.$set[`data.${session}.input`] = {id: 23};
        await col.updateOne(query, updateDoc, options);
        console.log(`upated input data for session - ${s_id} to mongo`)
    }

    async storeOutput (u_id : string, s_id : string, outputData : any) { // here output has the read and recived json from fmk model
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const options = { upsert: true };
        let session = `session_${s_id}`;
        let updateDoc = { $set: {} };
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


export { MongoTools, connectManager, EventManager, SessionManager};



//---------- Manog Template
/*
"uid": 1,
  "uname":'Sanath Jayasuriya',
  "data":{
    "session_1":{
      "input":{},
    	"output":{}
    },
    "session_2":{
    	"input":{},
    	"output":{}
    },
  },
  */




//export { connectionManager};


//TODO: code source -------
