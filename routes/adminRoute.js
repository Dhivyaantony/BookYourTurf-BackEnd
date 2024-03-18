const express = require('express');
const { addCourtData,addTimeSlotData,updateEditedCD,handleDeleteSlot } = require('../controllers/adminControl');
const router = express.Router();
const multer = require('multer');
const Courts = require('../Model/courtModel');
const bookedTimeSlots=require('../Model/timingModel')
const { adminAuth } = require('../middlewares/authorization');

// Define storage configuration
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/courts')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const upload=multer({storage:fileStorage})

router.post('/addCourtData',adminAuth, upload.single('courtImage'),addCourtData)
router.post('/addTimeSlotData',adminAuth,addTimeSlotData)
router.post('/updateEditedCD',adminAuth,updateEditedCD)
router.post('/handleDeleteSlot',adminAuth,handleDeleteSlot)
module.exports = router;