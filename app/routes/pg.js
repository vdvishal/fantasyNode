const pg = require('../controllers/pg/index')

 


module.exports.setRouter = (app) => {
    app.post(`${process.env.BASE_URL}/payment/`,pg);

     
}

