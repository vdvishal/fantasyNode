const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_05glXE1CJZE2Hd',
    key_secret: 'S1FpJ91q0nUQ3DqP3Q8I3jva'
  })



  const createOrder = (req,res) => {
      
    var options = {
        amount: 500,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_1sda1",
        payment_capture: '1'
      };
      console.log(options);

    instance.orders.create(options, function(err, order) {
        console.log(order);
        console.log(err);

        res.status(200).json(order)
      });
  }


module.exports = createOrder;