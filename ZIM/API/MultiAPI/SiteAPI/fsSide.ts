const exp = require('express');
const bodyParser = require('body-parser');
imprt {MongoTools} from './tools'



const app = exp()
const mongo = new MongoTools('admin', 'pass')
app.use(exp.json())
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
 //comment here


app.get('/sendInputs', (req, res) => {

})