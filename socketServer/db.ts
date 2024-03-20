
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


    async findActiveSim(userId : number) {
        try {
            await this.connect()
            const collection = this.Mongo.db("ZimularDB").collection("users");
            
            // Fetch the document based on user ID
            const doc = await collection.findOne({ "uid": userId });

            console.log("Doc retrived: " , doc);
            
            if (doc && doc.simulations) {
                // Iterate over the simulations to find the one with "active" status
                for (const simId in doc.simulations) {
                    if (doc.simulations[String(simId)].status === "active") {
                        console.log(`Active simulation ID for user ${userId}:`, simId);
                        return simId; // Return the ID of the active simulation
                    }
                }
                
                console.log("No active simulations found for this user.");
                return null; // Return null if no active simulations are found
            } else {
                console.log("Document or simulations not found.");
                return null;
            }
        } catch (error) {
            console.error("Error in findSim:", error);
            throw error; // Or handle it as per your application's error handling policy
        }
    }

    async getLatestSimulationId(userId : number) {
        try {
            await this.connect()
            const collection = this.Mongo.db("ZimularDB").collection("users");
            
            // Fetch the specific document based on user ID
            const doc = await collection.findOne({ "uid": userId });
            
            if (doc && doc.simulations) {
                // Get all simulation IDs as numbers, find the max
                const latestSimulationId = Math.max(...Object.keys(doc.simulations).map(Number));
                
                // Check if the result is a finite number (in case of an empty object, it would be -Infinity)
                if (isFinite(latestSimulationId)) {
                    console.log(`Latest simulation ID for user ${userId}:`, latestSimulationId);
                    return latestSimulationId;
                } else {
                    console.log("No simulations found for this user.");
                    return null;
                }
            } else {
                console.log("Document or simulations not found.");
                return null;
            }
        } catch (error) {
            console.error("Error in getLatestSimulationId:", error);
            throw error; // Or handle it as per your application's error handling policy
        }
    }


    async createEmptySim(userId : number) {
        try {
            await this.connect()
            const collection = this.Mongo.db("ZimularDB").collection("users");

            let simId = Number(await this.getLatestSimulationId(userId)) + 1 ;

            // Define the structure of the new simulation
            const newSim = {
                [`simulations.${simId}`]: {
                    status: "active",
                    sessions: {
                        "1": {} // Initializing the first session as an empty object
                    },
                    ui: {} // Initializing ui as an empty object
                }
            };

            // Update the document for the specified user ID
            const updateResult = await collection.updateOne(
                { "uid": userId }, // Filter document by user ID
                { $set: newSim } // Use $set operator to add the new simulation
            );

            if (updateResult.matchedCount === 0) {
                console.log("User ID not found.");
                return null; // User ID was not found in the collection
            } else if (updateResult.modifiedCount === 1) {
                console.log(`Empty simulation with ID ${simId} created for user ${userId}.`);
                return simId; // Successfully created the empty simulation
            } else {
                console.log("Simulation was not created.");
                return null; // The operation did not succeed
            }
        } catch (error) {
            console.error("Error in createEmptySim:", error);
            throw error; // Or handle it as per your application's error handling policy
        }
    }


    async createNextSession(userId : number , simId : number, ses_id : number) {
        try {
            await this.connect()
            const collection = this.Mongo.db("ZimularDB").collection("users");

            

            // Define the structure of the new simulation
            const newSes = {
                [`simulations.${simId}.sessions.${ses_id}`]: {
                    inputs: {},
                    outputOV: {}
                }
            };

            // Update the document for the specified user ID
            const updateResult = await collection.updateOne(
                { "uid": userId }, // Filter document by user ID
                { $set: newSes } // Use $set operator to add the new simulation
            );

            if (updateResult.matchedCount === 0) {
                console.log("User ID not found.");
                return null; // User ID was not found in the collection
            } else if (updateResult.modifiedCount === 1) {
                console.log(`Empty session with ID ${ses_id} created for user ${userId}.`);
                return ses_id; // Successfully created the empty simulation
            } else {
                console.log("Simulation was not created.");
                return null; // The operation did not succeed
            }
        } catch (error) {
            console.error("Error in createEmptySim:", error);
            throw error; // Or handle it as per your application's error handling policy
        }
    }

    async connect() {
        await this.Mongo.connect();
        await this.Mongo.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
    async test_conct() {
        await this.Mongo.connect();
        await this.Mongo.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await this.Mongo.close();
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

    async storeUI (uid : number, simID : number, data : any) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const qry = {uid : Number(uid)};
        const options = { upsert: true };
        let updateDoc :any = { $set: {} };
        updateDoc.$set[`simulations.${simID}.ui`] = data;
        await col.updateOne(qry, updateDoc, options);
        console.log(`upated ui for the simualtion ${simID}`)
    }

    async storeInput(u_id : number, sim_id : number , ses_id : number , data : any) {
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: u_id };
        const options = { upsert: true };
        let updateDoc :any = { $set: {} };
        updateDoc.$set[`simulations.${sim_id}.sessions.${ses_id}.input`] = data;
        await col.updateOne(query, updateDoc, options);
        console.log(`upated input data for session - ${ses_id} to mongo`);
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

// (async () => {
//     console.log("findSim : ",await mongo.createEmptySim(1));
// })();


export { mongo };