const courts = require('../Model/courtModel');
const bookedTimeSlots=require('../Model/timingModel')

const addCourtData = async (req, res) => {
  try {
    const { courtName, sportType, location, description, address } = req.body;
    const courtImage = req.file.filename; // Use req.file.path for the file path


    // Create a new court document
    const newCourt = new courts({
      courtName,
      sportType,
      location,
      description,
      address,
      courtImage,
    });

    // Save the court data to MongoDB
    await newCourt.save();

    // Respond with a success message
    res.status(200).json({ message: 'Court data added successfully' });
  } catch (error) {
    console.error('Error:', error);
    // Respond with an error message
    res.status(500).json({ error: 'Internal server error' });
  }
};
const addTimeSlotData = async (req, res) => {
    console.log(req.body)
  try{
    // console.log(req.body, '');
    const {startDate, endDate, selectedTimings, courtId,cost} = req.body;   //Destructuring method
    console.log(startDate, endDate, selectedTimings, courtId,cost);
    let firstDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const slotObject = [];
    const omittedSlots = [];

    while(firstDate <= lastDate) {
        for (let data of selectedTimings) {
            console.log(firstDate, "first date");

            const existingSlot = await bookedTimeSlots.findOne({
                date: firstDate,
                'slot.name':data.name,
                courtId,
            });
            console.log(existingSlot)
            if(!existingSlot){
                slotObject.push({
                    date:JSON.parse(JSON.stringify(firstDate)),    //To pass the date as value instead od reference use json parse
                    slot:{
                        name:data.name,
                        id:data.id,
                    },
                    courtId,
                    cost,
                });
            } else{
                omittedSlots.push({
                    
                    date:JSON.parse(JSON.stringify(firstDate)),    //To pass the date as value instead od reference use json parse
                    slot:{
                        name:data.name,
                        id:data.id,
                    },
                    cost,
                    courtId
                });
            }
        }
        firstDate.setDate(firstDate.getDate()+1);
    }
    if(slotObject.length > 0) {
        bookedTimeSlots.insertMany(slotObject).then((resp)=>{            
            res.status(200).json('Time slots created Successfully');
        })
    }
   /* if(slotObject.length === 0 && omittedSlots.length == 1) {
        res.status(200).json('These slot is already added');
    }*/
    console.log('Omitted slots:', omittedSlots);
    console.log('Added slots:', slotObject);
    }catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error'); 
    }
};
const handleDeleteSlot = async (req, res) => {
    try {
        console.log(req.body, "Request is:");
        const { selectedSlotIds } = req.body;

        // Validate selectedSlotIds as array of ObjectIds
        if (!Array.isArray(selectedSlotIds) || selectedSlotIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ error: 'Invalid selectedSlotIds' });
        }

        const deleteData = await bookedTimeSlots.deleteMany({
            _id: { $in: selectedSlotIds },
        });

        if (deleteData.deletedCount > 0) {
            console.log(deleteData.deletedCount, " slots Deleted");
            return res.status(200).json({ message: "Slots deleted successfully" });
        } else {
            // Return 204 No Content for no slots found
            return res.status(204).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

    




const updateEditedCD=(req,res)=>{
  console.log(req.body);
  courts.updateOne({_id:req.body._id},{$set:{courtName:req.body.courtName,location:req.body.location,address:req.body.address,sporttype:req.body.type}}).then((response)=>{
    res.status(200).json({response})
  })

}
module.exports = { addCourtData, addTimeSlotData ,updateEditedCD,handleDeleteSlot }