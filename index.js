const express =require('express');
const cors=require('cors');
const bodyParser= require("body-parser");

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uizyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app =express();
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnDB").collection("products");
  const ordersCollection = client.db("emaJohnDB").collection("orders");
  app.post('/addProduct',(req,res)=>{
      productsCollection.insertOne(req.body)
      .then(result=>{
          console.log(result.insertedCount);
          res.send(result.insertedCount>0);
      })
  })
  app.get('/allProduct',(req,res)=>{
      productsCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })
  app.get('/product/:key',(req,res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
  })

app.post('/productByKeys',(req,res)=>{
    const keys=req.body;
    productsCollection.find({key: {$in: keys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })
})
app.post('/addOrder',(req,res)=>{
    const order=req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})
});

app.get('/',(req,res)=>{
    res.send("backend Deploed on heroku");
})

app.listen(process.env.PORT || 4000,()=>{
    console.log("Server running in port 4000");
})