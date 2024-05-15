const express= require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.Food_Id}:${process.env.Food_Pass}@cluster0.x8jkuyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
const foodCollection = client.db('foodSharePlus').collection('foodSharePlusSarver');



app.post('/foodSharePlusSarver',async(req,res)=>{
    const newFoodSharePlusSarver =req.body 
    console.log(newFoodSharePlusSarver)
    const result =await foodCollection.insertOne(newFoodSharePlusSarver)
    res.send(result)
})



app.get('/foodSharePlusSarver',async(req,res)=>{
    const cursor= foodCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})


app.get('/FoodDetails/:id',async(req,res)=>{
    console.log(req.params.id)
    const result = await foodCollection.findOne({_id: new ObjectId(req.params.id)})
    res.send(result)
})
app.get('/ManageMyFoods/:email',async(req,res)=>{
    console.log(req.params.email)
    const result = await foodCollection.find({email:req.params.email}).toArray();
    res.send(result)
})
// app.get('/MyFoodRequest/:requesrUseremail',async(req,res)=>{
//     console.log(req.params.requesrUseremail)
//     const result = await foodCollection.find({email:req.params.requesrUseremail}).toArray();
//     res.send(result)
// })
app.get('/myFoodRequest/:email',async(req,res)=>{
    // const user = req.user.email
    const email= req.params.email
    // if(user!==email){
    //     return res.status(403).send({message:'Forbidden Access'})
    // }
    const filter={requesrUseremail:email,FoodStatus:"request"}
    const result = await foodCollection.find(filter).toArray();
    res.send(result)
    console.log(email)
    
})
app.get('/AvailableFoods/:email',async(req,res)=>{
    // const user = req.user.email
    const email= req.params.email
    // if(user!==email){
    //     return res.status(403).send({message:'Forbidden Access'})
    // }
    const filter={email:email,FoodStatus:"Available"}
    const result = await foodCollection.find(filter).toArray();
    res.send(result)
    console.log(email)
    
})



app.delete('/delete/:id',async(req,res)=>{
    const result = await foodCollection.deleteOne({
        _id: new ObjectId(req.params.id)
    })
    console.log(result)
    res.send(result)
})


app.put('/updatePost/:id',async(req,res)=>{
    console.log(req.params.id)
    const query ={_id:new ObjectId(req.params.id)}
    const option = {upsert:true}
    const data= {
        $set:{
            
            AdditionalNotes:req.body.AdditionalNotes,
            RequestDate:req.body.RequestDate,
            requesrUseremail:req.body.requesrUseremail,
            FoodStatus:req.body.FoodStatus

          
        }
    }
    const result = await foodCollection.updateOne(query,data,option)
    console.log(result);
    res.send(result)
})


app.put('/updatePostManage/:id',async(req,res)=>{
    console.log(req.params.id)
    const query ={_id:new ObjectId(req.params.id)}
    
    const data= {
        $set:{
            
            AdditionalNotes:req.body.AdditionalNotes,
            FoodName:req.body.FoodName,
            FoodQuality:req.body.FoodQuality,
            PickupLocation:req.body.PickupLocation,
            FoodStatus:req.body.FoodStatus,
            FoodQuantity:req.body.FoodQuantity,
            FoodPhotoUrl:req.body.FoodPhotoUrl,
            time:req.body.time,
            date:req.body.date,
            

          
        }
    }
    const result = await foodCollection.updateOne(query,data)
    console.log(result);
    res.send(result)
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



app.get('/',(req,res)=>{
    res.send('FoodSharing Plus is started')
})

app.listen(port,()=>{
console.log(`FoodSharing Plus is running on port ${port}`)
})