const pg = require('../controllers/pg/index')
const success = require('../controllers/pg/success')
const transaction = require('../controllers/pg/transaction')

const isAuth = require('../middlewares/passport/isAuthenticate')


module.exports.setRouter = (app) => {
    app.post(`${process.env.BASE_URL}/payment/`,isAuth,pg);

    app.post(`${process.env.BASE_URL}/payment/success`,isAuth,success);

    app.get(`${process.env.BASE_URL}/payment/transaction`,isAuth,transaction);

}

