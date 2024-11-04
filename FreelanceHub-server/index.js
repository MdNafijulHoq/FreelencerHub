const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://freelancehub-7580d.web.app',
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

    // Get all bids by a specific user
    app.get('/my-bids/:email', async(req, res) => {
        const email = req.params.email
        const query = {email: email};
        const result = await bidsCollection.find(query).toArray()
        res.send(result)
    })

    // Get all bid requests from db for Job owner
    app.get('/bid-requests/:email', async(req, res) => {
        const email = req.params.email
        const query = {'buyer.email': email};
        const result = await bidsCollection.find(query).toArray()
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

        // check if it is a duplicate request
        const alreadyApplied = await bidsCollection.findOne(
           { email: bidData.email,
            jobId: bidData.jobId,}
        )
        if(alreadyApplied){
            return res.status(400).send('You have placed a bid on this job')
        }

        const result = await bidsCollection.insertOne(bidData)

        // update bid count in jobs collection
        const updateDoc = {      
            $inc: { bid_count: 1},
        }
        const jobQuery = {_id: new ObjectId(bidData.jobId)}
        const updateBidCount = await jobsCollection.updateOne(jobQuery, updateDoc)
        console.log(updateBidCount)
        res.send(result)
    })

    // Update Bid status from Bid Request page
    app.patch('/bid/:id', async(req, res) => {
        const id = req.params.id
        const status = req.body
        const query = {_id: new ObjectId(id)}
        const updateDoc = {
            $set: status,
        }
        const result = await bidsCollection.updateOne(query, updateDoc)
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

    
    // Get all jobs data from db for count
    app.get('/jobs-count', async(req, res) => {
        const filter = req.query.filter
        const search = req.query.search
        let query = {
            job_title: {$regex: search, $options: 'i'}
        }
        if(filter){
            // query = {category: filter}
            query.category = filter
        }
        const count = await jobsCollection.countDocuments(query)
        res.send({count})
    })

    
    // Get all jobs data from db for pagination
    app.get('/all-jobs', async(req, res) => {
        const size = parseInt(req.query.size)
        const page = parseInt(req.query.page) - 1
        const filter = req.query.filter
        const sort = req.query.sort
        const search = req.query.search
        let query = {
            job_title: {$regex: search, $options: 'i'}
        }
        if(filter){
            // query = {category: filter}
            query.category = filter
        }
        let options = {}
        if(sort){
            options = {sort: {deadline: sort === 'asc' ? 1 : -1}}
        }
        console.log(size, page)
        const result = await jobsCollection.find(query, options).skip(page * size).limit(size).toArray()
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
