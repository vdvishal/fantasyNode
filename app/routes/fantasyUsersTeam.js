const fantasyUsersTeam = require('../controllers/fantasyUsersTeam')
const isAuth = require('../middlewares/passport/isAuthenticate')

const { get,post } = fantasyUsersTeam;
const { patch } = fantasyUsersTeam;
module.exports.setRouter = (app) => {

    
    //pos
    app.post(`${process.env.BASE_URL}/team/user/`,isAuth,post);
    
    app.get(`${process.env.BASE_URL}/team/user/all/:matchId`,isAuth,get.getPlayersByUserId);

    app.get(`${process.env.BASE_URL}/team/user/:matchId/:teamId`,isAuth,get.getTeamById);

    app.patch(`${process.env.BASE_URL}/team/user/:teamId`,isAuth,patch);
}

