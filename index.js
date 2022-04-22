const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const objectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//info db
//username: dbuser1
//password: aKqlnb3pakRkNvZW



const uri = "mongodb+srv://dbuser1:aKqlnb3pakRkNvZW@cluster0.vnhh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userscollection = client.db("foodExpress").collection("users");

        //LOAD Data to the client side
        app.get("/user", async (req, res) => {
            const query = {};
            const cursor = userscollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })
        //POST User: Added a new User
        app.post("/user", async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userscollection.insertOne(newUser)
            res.send(result)
        })
        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })


        //Delete a user
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await userscollection.deleteOne(query);
            res.send(result);

        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir())
app.get("/", (req, res) => {
    res.send("Running my node CRUD Server");
})
app.listen(port, () => {
    console.log('Crud server is running');
})