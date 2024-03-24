
const { MongoClient, ServerApiVersion }  = require('mongodb');
import * as dotenv from 'dotenv';
import path from 'path';
// Configure dotenv to load the .env file from the 'test' directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Now you can access the environment variables as usual
console.log(process.env.YOUR_ENV_VARIABLE);

class MongoTools {

    public Mongo;
    public url;
    constructor(usrnm : string, pass : string)  {
        this.url = process.env.MONGO_URL;
        this.Mongo = new MongoClient(this.url,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }





    public async getLatestUser() {
        await this.connect();
        const collection = this.Mongo.db("ZimularDB").collection("users");
    
        // Find the user with the highest uid
        const latestUser = await collection.find().sort({uid: -1}).limit(1).toArray();
        if (latestUser.length === 0) {
          // Handle the case where there are no users yet
          return null;
        }
        return latestUser[0];
      }
    
      public async createUser(uname : string, pass : string) {
        await this.connect();
        const collection = this.Mongo.db("ZimularDB").collection("users");

        let customStructure = {
            email : uname,
            password :  pass,
            simulations : {
                1 : {
                    status : "active",
                    sessions : {
                        1 : {
                            inputs : {},
                            outputOV : {}
                            
                        }
                    },
                    ui : {}
                }
            }
        }
        // Get the latest user to determine the next uid
        const latestUser = await this.getLatestUser();
        const nextUid = latestUser ? latestUser.uid + 1 : 1; // Start from 1 if no users are found
    
        // Create the new user document with the custom structure and the next uid
        const newUser = {
          uid: nextUid,
          ...customStructure, // Merge the custom structure into the new user document
        };
    
        // Insert the new user document into the collection
        await collection.insertOne(newUser);
    
        console.log("New user created with uid:", nextUid);
        return newUser;
      }


    async findActiveSim(userId : number) {
        try {
            await this.connect()
            const collection = this.Mongo.db("ZimularDB").collection("users");
            
            // Fetch the document based on user ID
            const doc = await collection.findOne({ "uid": userId });

            //console.log("Doc retrived: " , doc);
            
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


    public async getSesForOutputs(uid: number) {
        let simulation_id = await this.findActiveSim(uid);
        await this.connect();
        const collection = this.Mongo.db("ZimularDB").collection("users");
      
        // Find the user with the given uid
        const user = await collection.findOne({ uid: uid });
        if (!user) throw new Error('User not found.');
      
        const simulations = user.simulations;
        if (!simulations) throw new Error('Simulations not found.');
      
        const simulation = simulations[simulation_id];
        if (!simulation) throw new Error(`Simulation ${simulation_id} not found.`);
      
        const sessions = simulation.sessions;
        if (!sessions) throw new Error('Sessions not found.');
      
        // Extract session names and ids
        const sessionEntries = Object.entries(sessions);
        const sessionInfoArray = sessionEntries.map(([ses_id, _]) => ({
          ses_name: `session_${ses_id}`,
          ses_id: ses_id,
        }));
      
        return sessionInfoArray;
      }
      

    public async getSimsForOutputs() {
        await this.connect();
        const collection = this.Mongo.db("ZimularDB").collection("users");
        const pipeline = [
            {
                $project: {
                    simulationsArray: { $objectToArray: "$simulations" }
                }
            },
            { $unwind: "$simulationsArray" },
            {
                $project: {
                    sim_id: "$simulationsArray.k",
                    sim_name: "$simulationsArray.v.sessions.1.outputOV.overview.details.simulation_name"
                }
            }
        ];
        const result = await collection.aggregate(pipeline).toArray();
        return result.map(({ sim_id, sim_name }) => ({
            sim_id: parseInt(sim_id), // Convert string ID to integer if necessary
            sim_name
        }));
    }


    public async loginUser(uname: string, pass: string) {
        await this.connect();
        const collection = this.Mongo.db("ZimularDB").collection("users");
    
        // Attempt to find the user by username
        const user = await collection.findOne({ uname: uname });
    
        // If the user is found, check the password
        if (user && user.password === pass) {
          console.log("Login successful");
          return true; // Password matches, login successful
        } else {
          console.log("Login failed");
          return false; // User not found or password does not match
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
                        "1": {
                            inputs: {},
                            outputOV: {}
                        } // Initializing the first session as an empty object
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

    async getUI (u_id : number) {
        await this.connect()
        let simID = await this.findActiveSim(u_id);
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: u_id };
        const result = await col.findOne(query);
        return result.simulations[simID].ui;
    }

    async terminateSim (uid : number) {
        await this.connect()
        let simID = await this.findActiveSim(uid);
        const col = this.Mongo.db("ZimularDB").collection("users");
        const qry = {uid : uid};
        const options = { upsert: true };
        let updateDoc :any = { $set: {} };
        updateDoc.$set[`simulations.${simID}.status`] = "completed";
        await col.updateOne(qry, updateDoc, options);
        console.log(`upated status for the simualtion ${simID}`);
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
        updateDoc.$set[`simulations.${sim_id}.sessions.${ses_id}.inputs`] = data;
        await col.updateOne(query, updateDoc, options);
        console.log(`upated input data for session - ${ses_id} to mongo`);
    }

    async storeOutput (u_id : number, sim_id : number, ses_id : number ,outputData : any , func : string) { // here output has the read and recived json from fmk model
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const options = { upsert: true };
        let updateDoc :any  = { $set: {} };

        const query2 = { uid: Number(u_id) };
        const result2 = await col.findOne(query);
        let ovdoc = result2.simulations[sim_id].sessions[ses_id].outputOV;
        let updatedOvdoc = {
            ...ovdoc,
            ...outputData // This will add new properties from outputData and update existing ones
          };
        
        updateDoc.$set[`simulations.${sim_id}.sessions.${ses_id}.outputOV`] = updatedOvdoc;
        const updated = await col.updateOne(query, updateDoc, options);
        console.log(`upated output overview data for session - ${ses_id} to mongo`)
        


// Now, use updateDoc in your update operation

    }

    async getOutput (u_id : number, sim_id : number , ses_id : number) {
        console.log("getoutput" , u_id , sim_id , ses_id);
        await this.connect()
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(u_id) };
        const result = await col.findOne(query);
        return result.simulations[sim_id].sessions[ses_id].outputOV.overview;
    }
 
    async getsuboutputs (uid : number, sim_id : number ,ses_id : number, option : string) {
        await this.connect()
        //let sim_id = await this.findActiveSim(uid);
        const col = this.Mongo.db("ZimularDB").collection("users");
        const query = { uid: Number(uid) };
        const result = await col.findOne(query);
        return result.simulations[sim_id].sessions[ses_id].outputOV[option];
    }


}


let mongo = new MongoTools('admin', 'pass');

// (async () => {
//     console.log("findSim : ",await mongo.createEmptySim(1));
// })();


export { mongo };