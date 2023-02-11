const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const appRoutes = require('./routes/route1')

//global constants
const PORT_NO = 9000
const DB_NAME = 'NFTmetadata'
const userword = ""
const awsKeys = ""

const app = express();
const username = "sushant"
const pass = "abc"
const mongoUri = `mongodb+srv://${username}:${pass}@cluster0.cyab5du.mongodb.net/NFTmetadata?retryWrites=true&w=majority`

const {MongoClient} = require('mongodb');
var Server = require('mongodb').Server;

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())


app.get('/:id', async(req, res) => {
    await client.connect();
    db = client.db("NFTmetadata").collection("metadatanfts")
    const metaData = await db.findOne({ tokenId: 1111 })
    res.status(200).json(metaData)
    console.log(req.path)
});

app.post('/update', async(req, res) => {
    await client.connect();
    db = client.db("NFTmetadata").collection("metadatanfts")
    const setObj = {name: "new name", amount: 26}
    db.updateOne({ tokenId: 1111 }, { $set: {metadata: setObj} });
    res.send('Successful response.');
});

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    //console.log(await db.findOne({ tokenId: 1111 }))
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 
let client
let db
async function a() {
    client = new MongoClient(mongoUri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db("NFTmetadata").collection("metadatanfts")
        // Make the appropriate DB calls
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

app.listen(PORT_NO, async (req,res) => {
    client = new MongoClient(mongoUri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db("NFTmetadata").collection("metadatanfts")
        // Make the appropriate DB calls
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    console.log("listenng")
})

// mongoose.set('strictQuery', true)

// mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => {
//         app.listen(PORT_NO, () => {console.log(`Server listening on PORT: ${PORT_NO}`)})
//     })
//     .catch((error) => console.log(error.message))