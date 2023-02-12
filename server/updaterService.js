const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

//global constants
const PORT_NO = 9000

const app = express();
const username = "sushant"
const pass = "abc"
const mongoUri = `mongodb+srv://${username}:${pass}@cluster0.cyab5du.mongodb.net/NFTmetadata?retryWrites=true&w=majority`

const {MongoClient} = require('mongodb');

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())


app.get('/:id', async(req, res) => {
    const cid = req.path.split("/")[1]
    await client.connect();
    db = client.db("NFTmetadata").collection("metadatanfts")
    const metaData = await db.findOne({ tokenId: parseInt(cid) })
    res.status(200).json(metaData.metadata)
});

app.post('/update/:id', async(req, res) => {
    const cid = parseInt(req.path.split("/")[2])
    const body = req.body
    await client.connect();
    db = client.db("NFTmetadata").collection("metadatanfts")
    db.updateOne({ tokenId: cid }, { $set: {metadata: body} });
    res.send('Successful response.');
});

app.post('/create-position/:id', async(req, res) => {
    const cid = parseInt(req.path.split("/")[2])
    const body = req.body
    await client.connect();
    db = client.db("NFTmetadata").collection("metadatanfts")
    db.insertOne( {tokenId: cid, metadata: body} );
    res.send('Successful response.');
});
 

app.listen(PORT_NO, async (req,res) => {
    client = new MongoClient(mongoUri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db("NFTmetadata").collection("metadatanfts")
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    console.log("Server Started...")
})