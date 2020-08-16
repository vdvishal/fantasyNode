const Razorpay = require('razorpay');
const moment = require('moment');
const crypto = require('crypto');
const User = mongoose.model('Users');

var instance = new Razorpay({
    key_id: 'rzp_test_XUhylBt5ecsoht',
    key_secret: 'UJCgfHCLRAYGqmBKtvgFzbdq'
  })

  
 let p = {
    entity: {
      id: 'pay_FHF7CT5hFAaMtk',
      entity: 'payment',
      amount: 10000,
      currency: 'INR',
      status: 'captured',
      order_id: 'order_FHF4N4Z9PgjGip',
      invoice_id: null,
      international: false,
      method: 'card',
      amount_refunded: 0,
      refund_status: null,
      captured: true,
      description: null,
      card_id: 'card_FHF7CYtx1TC7AD',
      card: {
        id: 'card_FHF7CYtx1TC7AD',
        entity: 'card',
        name: 'hfchjj',
        last4: '1111',
        network: 'Visa',
        type: 'debit',
        issuer: null,
        international: false,
        emi: false,
        global_fingerprint: '90cfea87d266c148bf72e368ba9742d9',
        sub_type: 'consumer'
      },
      bank: null,
      wallet: null,
      vpa: null,
      email: 'vishalvdutta@gmail.com',
      contact: '+916003633574',
      notes: [],
      fee: 200,
      tax: 0,
      error_code: null,
      error_description: null,
      error_source: null,
      error_step: null,
      error_reason: null,
      acquirer_data: { auth_code: '315528' },
      created_at: 1595355713
    }
  }
  




  const webHook = (req,res) => {
    
  }


module.exports = webHook;