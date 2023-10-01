require("dotenv").config()
const connectToMongo =require("./db");
connectToMongo();
const express = require("express")
var fetchuser = require("./middleware/fetchUser")
const app  = express();
const port = 4000;
const User = require("./models/user")
const bcrypt = require("bcryptjs")
const Events = require("./models/event")
var jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const cors = require('cors');

app.use(cors());
app.use(express.json());


/******************************* add to database *********************************************/

app.post("/register",async(req,res)=>{
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {return res.status(400).json({success,
            error: "sorry but the user with the same email already exists",
        });
       }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            email : req.body.email,
            name : req.body.name,
            password : secPass
        })
        const data = {
            user : {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken});

    } catch (error) {
      res.status(500).send("some error occured");
    }
})

/*****************************login user *******************************************************/

app.post("/login",async(req,res)=>{
    let success = false;
    try {
     const {email,password} = req.body;
     let user = await User.findOne({email : email});
     if(!user){
      return res.status(400).json({success,message : "user doesnot exists"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, message: "Password is wrong" });
    }
    const data = {
      user : {
         id : user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success,authtoken});  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
 })

/*****************************fetch all events *******************************************************/

  app.get("/fetchallevents",fetchuser,async(req,res)=>{
    try {
      const events = await Events.find({ collaborators: { $elemMatch: { user: req.user.id } } })
      .sort({ updatedAt: -1 });
      res.json(events);
    } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
    }
})

/***************************** Add events *******************************************************/

app.post("/addevent",fetchuser,async(req,res)=>{
    try {
      const event = new Events({
        author : req.user.id,
        id : req.body.id,
        title : req.body.title,
        start : req.body.start,
        end : req.body.end,
        allDay : req.body.allDay,
        collaborators: [{ user: req.user.id }],
    })
    const savedevent = await event.save();
    const updatedEvent = await Events.findOneAndUpdate(
      { _id: savedevent._id }, 
      { $set: { id: savedevent._id } },
      { new: true } 
    );
    res.json(savedevent);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  })
  
/***************************** delete events *******************************************************/

app.delete("/deleteevent/:id",async (req, res) => {
  try {
      let event = await Events.findById(req.params.id);
      if(!event){return res.status(404).send("NOT Found")}
      event = await Events.findByIdAndDelete(req.params.id);
      res.json({event});
  } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
  }
})


/***************************** Share events *******************************************************/

app.post('/shareevent', fetchuser, async (req, res) => {
  try {
    let success = false;
    const { share, eventid } = req.body;
    const event1 = await Events.findById(eventid);
    if (!event1) {
      return res.status(404).json({ success,error: 'Event not found' });
    }
    const user = await User.findOne({ email: share });
    if(!user){
        return res.status(400).json({success,message : "user doesnot exists"})
    }
    event1.collaborators.push({ user: user._id });
    await event1.save();
    success = true;
    return res.json({ success, event1 });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Some error occurred');
  }
});


/***************************** Edit Event *******************************************************/

app.post("/editevent/:id",fetchuser,async(req,res)=>{
  try {
    let event1 = await Events.findById(req.params.id);
    if (!event1) {
      return res.status(404).json({ message: "Event not found" });
    }
    event1.title = req.body.title;
    await event1.save();
    res.json({event1});
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("some error occurred");
  }
});


 /**********************listening on port **************************************/

 app.listen(port,()=>{
    console.log("server started on port 4000");
})



