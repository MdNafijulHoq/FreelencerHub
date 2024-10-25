const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
    ],
    Credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.33r9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const jobsCollection = client.db('freelanceHub').collection('jobs')
    const bidsCollection = client.db('freelanceHub').collection('bids')

    // Get all jobs data from db
    app.get('/jobs', async(req, res) => {
        const result = await jobsCollection.find().toArray()
        res.send(result)
    })

    // Get a single job data from db using job id
    app.get('/job/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollection.findOne(query)
        res.send(result)
    })

    // Get all posted jobs by a specific user
    app.get('/jobs/:email', async(req, res) => {
        const email = req.params.email
        const query = {'buyer.email': email};
        const result = await jobsCollection.find(query).toArray()
        res.send(result)
    })

    // Save a bid data in db
    app.post('/job', async(req, res) => {
        const jobData = req.body
        const result = await jobsCollection.insertOne(jobData)
        res.send(result)
    })

    // Save a bid data in db
    app.post('/bid', async(req, res) => {
        const bidData = req.body
        const result = await bidsCollection.insertOne(bidData)
        res.send(result)
    })

    // Delete a job data from db using job id
    app.delete('/job/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollection.deleteOne(query)
        res.send(result)
    })

    // Update a job in db
    app.put('/job/:id', async(req, res) => {
        const id = req.params.id;
        const jobData = req.body
        const query = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateDoc = {
            $set: {
                ...jobData,
            }
        }
        const result = await jobsCollection.updateOne(query, updateDoc, options)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('Hello from FreelanceHub server...')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})