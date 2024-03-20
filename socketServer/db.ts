
const { MongoClient, ServerApiVersion }  = require('mongodb');


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


let mongo = new MongoTools('admin', 'pass');

export { mongo };