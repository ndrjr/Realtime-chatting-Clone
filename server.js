import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from "pusher";
import cors from 'cors';

const app=express();
const port=process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1627342",
  key: "409b97fd0289f964160c",
  secret: "dbd602e5ca0cd488ec88",
  cluster: "ap2",
  useTLS: true
});

/*app.use((req,res,next)=> {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","*");
  next();
});*/

const connection_url="mongodb+srv://derllinrajn:o7p25AVMF93hOS6Q@cluster0.dyru0q4.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(connection_url,{
    //useCreateIndex: true,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());


const db=mongoose.connection;
db.on('open',() => {
  console.log("DB connected");

  const msgCollection=db.collection("messagecontents");
  const changeStream=msgCollection.watch();
  changeStream.on("change",(change)=>{
    console.log("A Change occured",change);

    if (change.operationType==='insert'){
      const messageDetails=change.fullDocument;
      pusher.trigger('messages','inserted',
      {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received:messageDetails.received,
      }
    );
    } else{
      console.log('Error triggering Pusher');
    }
  });
});

app.get('/',(req,res)=>res.status(200).send('Hello'));

app.get("/api/v1/messages/sync", async (req, res) => {
  try {
    const data = await Messages.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/api/v1/messages/new',(req,res)=> {
    const dbMessage = req.body;

    Messages.create(dbMessage)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });

});

app.listen(port,()=>console.log(`Listening on local host:${port}`)); 