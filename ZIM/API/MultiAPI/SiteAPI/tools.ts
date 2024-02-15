const { MongoClient, ServerApiVersion }  = require('mongodb')
// connectionpool socket object structure
// {
//     'socketid' : 12,
//     'socket': socket

// }

class connectionManager {

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
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
        console.log(session)
        console.log(result[`data`])
        console.log(result.data[`${session}`].input);
    }

    async storeOutput (u_id : string, s_id : string, outputData : any) { // here output has the read and recived json from fmk model
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: u_id };
        const options = { upsert: true };
        let session = `session_${s_id}`;
        let updateDoc = { $set: {} };
        updateDoc.$set[`data.${session}.output`] = outputData;

// Now, use updateDoc in your update operation

        const updated = await col.updateOne(query, updateDoc, options);
    }


}

let mongo = new MongoTools('admin','pass');
mongo.storeOutput('1', '1',{id: 23});
let newDoc = mongo.getInputs('1','1')




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
