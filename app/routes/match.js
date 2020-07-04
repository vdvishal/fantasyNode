const match = require('../controllers/match/get')

const { getUpcoming,getByUserId } = match


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/match/`,getUpcoming);

    // get --> byUserId
    app.get(`${process.env.BASE_URL}/match/user/:status`,getByUserId);

}

