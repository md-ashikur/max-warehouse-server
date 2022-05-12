const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.peb5q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('maxWareHouse').collection('item');

        app.get('/item/', async(req, res) =>{
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        });
        // post
        app.post('/item', async(req, res) =>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })

        // DELETE
        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally { 

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('connect')
});

app.listen(port, () => {
    console.log('Example app listening on port', port);
})