const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware

app.use(cors());
app.use(express.json());


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kowhoxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri)

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
    // Connect the client to the server	(optional starting in v4.7)
    

    const craftCollection = client.db('craftDB').collection('craft');


    app.get('/craft', async(req,res)=>{
      const cursor = craftCollection.find();
      const result =await cursor.toArray();
      res.send(result);

     
    })

    // app.get('/craft:id', async(req,res)=>{
    //   const result = await craftCollection.findOne({ _id:new ObjectId(req.params.id),});
    //   console.log(result);
    //   res.send(result);
      

    // })



    

    app.get('/craft/:email', async(req,res)=>{
      console.log(req.params.email);
      const result=await craftCollection.find({email:req.params.email}).toArray();
      res.send(result);
    })

    app.get('/craft-by-id/:id', async(req,res)=>{
      const result = await craftCollection.findOne({ _id:new ObjectId(req.params.id),});
      console.log(result);
      res.send(result);
      

    })

    app.put('/craft/:id', async(req,res)=>{
      console.log(req.params.id, {body:req.body});
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
          $set: {
              image: body.image,
              item:body.item,
              subcategory:body.subcategory,
              price: body.price,
              rating:body.rating,
              customization:body.customization,
              time:body.time,
              stock:body.stock,
              description: body.description
              
          },
          
      };
      console.log({body})
      const result = await craftCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.post('/craft', async(req,res)=>{
        const newCraft= req.body;
        console.log(newCraft);
        const result =await craftCollection.insertOne(newCraft);
        res.send(result);
    })

    app.delete('/craft/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id:new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('deviantart server is running');
})

app.listen(port, ()=>{
    console.log(`devinantart server is running on port: ${port}`);
})
 //FF497c
 