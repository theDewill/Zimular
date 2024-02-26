const exp = require('express');
const bodyParser = require('body-parser');
const {MongoTools} = require('./tools');
const axios = require('axios');



const app = exp()
const mongo = new MongoTools('admin', 'pass')
app.use(exp.json())
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
 //comment here


app.get('/sendInputs', async (req, res) => {
    let uid = req.query.uid;
    let sid = req.query.sid;
    let data = req.query.data;
    await mongo.storeInput(uid, sid, data);
    //-- calling the input settings sender
    const response = await axios.post('http://localhost:3000/sendInputs', {
        uid: uid,
        sid: sid
    })
    
    
})

