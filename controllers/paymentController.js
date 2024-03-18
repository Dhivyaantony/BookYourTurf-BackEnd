const bookedTimeSlots = require('../Model/timingModel')
const Razorpay = require('razorpay');
const crypto = require('crypto')
const nodemailer=require('nodemailer');

const orders = async (req, res) => {
     console.log('inside payment controller',req.body);
    const slotData = await bookedTimeSlots.findOne({ _id: req.body.slotId })
    console.log(slotData)
    if (slotData?.bookedBy) {
        res.status(400).json({ message: 'slot already booked' })
    } else {
        try {
            const instance = new Razorpay({
                key_id: 'rzp_test_MjyoFZ3GHvHbzw',
                key_secret: 'TK8A2Y1MIVgmwJNDz069iRRZ',
            });

            const options = {
                amount: slotData.cost * 100, // amount in smallest currency unit
                currency: "INR",
                receipt: slotData._id,
            };

            const order = await instance.orders.create(options);

            if (!order) return res.status(500).send("Some error occured");

            res.json(order);
        } catch (error) {
            console.log(error)
            res.status(500).send(error);

        }
    }

}

const paymentSuccess = async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            slotId,
             // Make sure userId is present in req.body
        } = req.body;
            
        console.log(  orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            )

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "TK8A2Y1MIVgmwJNDz069iRRZ");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
await bookedTimeSlots.updateOne(
  { _id: slotId },
  {
    $set: {
      bookedBy: req.userid,
    },
    $push: {
      paymentorders: {
        userId: req.userid,
        razorpayPaymentId,
        timeStamp: new Date(),
      },
    },
  }
);
        initiateEmail(slotId,razorpayPaymentId)     
res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
        console.log(error,"===")  
    }
}
const initiateEmail = async (id, razorpayPaymentId) => {
    try {
        const slotData = await bookedTimeSlots.findOne({ _id: id }).populate('bookedBy').populate('courtId');

        if (!slotData) {
            console.error("Invalid ID or document not found");
            return; // or throw an error
        }

        const { date, slot, cost, bookedBy, courtId } = slotData;

        // Check if bookedBy is defined before accessing its properties
        const userName = bookedBy ? `${bookedBy.firstName} ${bookedBy.lastName}` : 'Unknown User';

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'dhivyajetlee@gmail.com',
                pass: 'hxph kszg idky ltiw'
                // Consider using environment variables or secure configuration
            }
        });

        const info = await transporter.sendMail({
            from: 'dhivyajetlee@gmail.com',
            to: 'chichuantony@gmail.com',
            subject: "Booking confirmed",
            text: "thanks for booking with us!",
            html: `<b>HELLO ${userName}</b>
            <p> your booking at ${courtId.name} on ${new Date(date)} at ${slot.name} has been confirmed with payment id ${razorpayPaymentId}</p>`,
        });

        console.log("Message sent:%s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        // Handle the error or log it appropriately
    }
};


module.exports = { orders, paymentSuccess }