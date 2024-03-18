const courts = require('../Model/courtModel');
const bookedTimeSlots = require('../Model/timingModel');
const ObjectId=require("mongoose").Types.ObjectId;

const getAllcourtData = (req, res) => {
    courts.find().then((response) => {
        res.status(200).json(response)
    })
        .catch((err) => {
            res.status(500).json(err)
        })
}
const getSinglecourtData = async (req, res) => {
    try {
        const result = await courts.findOne({ _id: req.query.courtId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getlatestupdateDate = (req, res) => {
    try {
        bookedTimeSlots.find({ courtId: req.query.courtId })
            .sort({ date: 1 })
            .limit(1)
            .select("date")
            .then((resp) => {
                let latestDate = new Date(resp[0]?.date);
                res.status(200).json({ minDate: latestDate });
            });
    } catch (error) {
        res.status(500).json(error)` `;
    }
};
const dayWiseTimeSlot = (req, res) => {
  try {
   
  
   console.log(req.query.courtId, req.query.date,"++++");
   let currentHour = new Date(req.query.date).getHours();
   let currentDate = new Date(new Date(req.query.date).setUTCHours(0, 0, 0, 0));
   bookedTimeSlots.aggregate([
       {
       $match: {
           courtId: new ObjectId(req.query.courtId),
           date: currentDate,
           "slot.id":{$gt: currentHour + 1 } ,         
       },
   },
       {
           $lookup:{
               from:"courts",
               localField:"courtId",
               foreignField:"_id",
               as:"court",

           },
       },
       {
           $project:{
               court:{ $arrayElemAt:["$court",0]},
               _id:1,
               date:1,
               slot:1,
               cost:1,
               bookedBy:1

           },
       },
   ])
       .then((response) => {
           console.log(response, "response");
           res.status(200).json(response)
       })
       .catch((err) => {
           console.log(err,"===");
       });
  
   } catch (error) {
   console.log(error)
   } };
       const getMybookingsData=(req,res)=>{      //aggregate function
const currentDate=new Date()  //present date
const  slotHour=currentDate.getHours() //slotid/hours
currentDate.setUTCHours(0,0,0,0)
console.log("Current Date:", currentDate);
    console.log("Slot Hour:", slotHour);
    
bookedTimeSlots.aggregate([
   {
       $match:{
           bookedBy:new ObjectId(req.userid),
           $expr:{
               $or:[
                   {$gt:['$date',currentDate]},
                   {$and:[
                       {$eq:['$date',currentDate]},
                       {$gt:['$slot.id',slotHour]}
                   ]}
                
               ]
           }
       }
       },
       {
   $lookup:{
       from:'courts',
       localField:'courtId',
       foreignField:'_id',
       as:'courts'
   }
       },
       //{....
   // courts:[{}]
//}
       {
        
          $project: {
              _id: 1,
              date: 1,
              slot: 1,
              courtData: { $arrayElemAt: ['$courts', 0] }
          
      }
      
       }
]).then((response)=>{
   console.log(response)
   res.status(200).json(response)
})
       
       };
  
module.exports = { getAllcourtData, getSinglecourtData, dayWiseTimeSlot, getlatestupdateDate,getMybookingsData }