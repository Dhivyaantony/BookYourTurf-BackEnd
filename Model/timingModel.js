// models/timingModel.js

/*const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema({
  courtId: { type: String, required: true },
  date: { type: Date, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timingId: String,
  timingFixedId: Number,
  cost: { type: Number, required: true },
});

const BookedTimeSlot = mongoose.model('BookedTimeSlot', timingSchema);

module.exports = BookedTimeSlot;*/
const mongoose=require('mongoose')

const timingSchema=mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
   slot:{
        type:Object,
        required:true
    },
   cost:{
        type:Number,
        required:true,
    },
    bookedBy:{
        type:mongoose.Types.ObjectId,
       ref:'users'      
    },
    Cancellation:{
        type:Array,//userid,payment
       
    },
   courtId:{
    type:mongoose.Types.ObjectId,
    ref:'courts'
    },
    paymentorders:{
        type:Array,
    }    
})

const bookedTimeSlots = mongoose.model("bookedTimeSlots", timingSchema);
module.exports = bookedTimeSlots;
