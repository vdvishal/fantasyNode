const pg = require('../controllers/pg_razor')
const success = require('../controllers/pg_razor/success')
const transaction = require('../controllers/pg_razor/transaction')

const Payout = require('../controllers/payout')

const GenSign = require('../controllers/pg_cashFree/generate_signature')

const isAuth = require('../middlewares/jwt/auth')


module.exports.setRouter = (app) => {
    app.post(`${process.env.BASE_URL}/payment/`,isAuth,pg);

    app.post(`${process.env.BASE_URL}/payment/success`,isAuth,success);

    app.get(`${process.env.BASE_URL}/payment/transaction`,isAuth,transaction);

    app.post(`${process.env.BASE_URL}/payout`,isAuth,Payout.payout);//,isAuth

    app.post(`${process.env.BASE_URL}/beneficiaries`,isAuth,Payout.beneficiaries);//,isAuth

    app.get(`${process.env.BASE_URL}/beneficiaries`,isAuth,Payout.beneficiaries);//,isAuth


    // CASHFREE

    app.get(`${process.env.BASE_URL}/gensign`,isAuth,GenSign);//,isAuth

}


