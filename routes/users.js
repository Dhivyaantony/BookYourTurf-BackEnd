// routes/users.js
const express = require('express');
const { userAuth } = require('../middlewares/authorization');
const { getAllcourtData, getSinglecourtData,  dayWiseTimeSlot,getMybookingsData} = require('../controllers/userControl');
const router = express.Router();


router.get('/getAllcourtData', userAuth, getAllcourtData);
router.get('/getSinglecourtData', userAuth, getSinglecourtData);
router.get('/dayWiseTimeSlot',userAuth,dayWiseTimeSlot)
router.get('/getMybookingsData',userAuth,getMybookingsData)

//router.get('/checkTimeSlot/:courtId/:date/:timing', userAuth, checkTimeSlot);
// Example middleware usage

module.exports = router;