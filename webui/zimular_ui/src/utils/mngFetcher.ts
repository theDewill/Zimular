// Import the MongoClient class from the MongoDB package.
const { MongoClient } = require('mongodb');

// MongoDB URI - replace `<username>`, `<password>`, and `<your-cluster-url>` with your actual MongoDB URI details.
const uri = "mongodb://admin:pass@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//TODO: simID and sesId : remove them if not needed
async function getUI(userid : number , sesID : number, simID : number) {
  try {
    
    await client.connect();
    // const database = client.db('ZimularDB');
    // const collection = database.collection('users');
    const collection = client.db('ZimularDB').collection('users');
    const query = { uid: userid  };
    const document = await collection.findOne(query);
    const sim_session = document ? document.simulations?.[String(simID)]?.sessions?.[String(sesID)] : null;
    return { sim_session }; // This creates an object literal with a property 'flowers'.
  } catch (err) {
    console.error('Failed to retrieve document:', err);
  } finally {
    // Ensure that the client will close when you finish/error.
    await client.close();
  }
}


export {getUI};

// (async () => {
//     console.log(await getDocument(1, 1, 1));
//   })();
  




