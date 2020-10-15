const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

require('../models/matches');
require('../models/fantasyPlayer');
require('../models/appStats');
 
const sms = require('../libraries/twilio');
 

const match = mongoose.model('Matches');
const axios = require('axios')
const chalk = require('chalk');

let FantasyPlayer = mongoose.model('FantasyPlayer');
let AppStats = mongoose.model('AppStats');

const instance = axios.create({
  baseURL: process.env.API_URL,
})


let liveIdArr = []


async function liveUpdate() {
  console.log(`${chalk.yellow("liveUpdate Online")}`)
  try {


    // let liveMatches =[]
    let liveMatches = await instance.get(`/livescores?api_token=${process.env.Access_key}&include=batting,batting.catchstump,batting.batsman,batting.bowler,bowling.team,bowling.bowler,lineup,batting.batsmanout,balls,balls.catchstump,scoreboards,league,season,localteam,visitorteam`)
      .then(response => response.data.data);


    let arr = [];

    console.log('liveMatches.length: ', liveMatches.length);

    let liveUpdate = []


    for (const matchDetail of liveMatches) {


      liveUpdate.push(matchDetail.id)




      let update = {

        "isLive": true,
        "type": matchDetail.type,
        "scoreboards": matchDetail.scoreboards,
        "league": matchDetail.league,
        "localteam": matchDetail.localteam,
        "season": matchDetail.season,
        "starting_at": matchDetail.starting_at,
        "status": matchDetail.status,
        "visitorteam": matchDetail.visitorteam,
        "balls": matchDetail.balls,
        "batting": matchDetail.batting,
        "bowling": matchDetail.bowling,

        "draw_noresult": matchDetail.draw_noresult,
        "elected": matchDetail.elected,
        "first_umpire_id": matchDetail.first_umpire_id,
        "follow_on": matchDetail.follow_on,
        "last_period": matchDetail.last_period,
        "league_id": matchDetail.league_id,
        "lineup": matchDetail.lineup,
        "live": matchDetail.live,
        "localteam_dl_data": matchDetail.localteam_dl_data,
        "localteam_id": matchDetail.localteam_id,
        "man_of_match_id": matchDetail.man_of_match_id,
        "man_of_series_id": matchDetail.man_of_series_id,
        "note": matchDetail.note,
        "referee_id": matchDetail.referee_id,
        "resource": matchDetail.resource,
        "round": matchDetail.round,
        "rpc_overs": matchDetail.rpc_overs,
        "rpc_target": matchDetail.rpc_target,
        "season_id": matchDetail.season_id,
        "second_umpire_id": matchDetail.second_umpire_id,
        "stage_id": matchDetail.stage_id,
        "super_over": matchDetail.super_over,
        "toss_won_team_id": matchDetail.toss_won_team_id,
        "total_overs_played": matchDetail.total_overs_played,
        "tv_umpire_id": matchDetail.tv_umpire_id,
        "type": matchDetail.type,
        "venue_id": matchDetail.venue_id,
        "visitorteam_dl_data": matchDetail.visitorteam_dl_data,
        "visitorteam_id": matchDetail.visitorteam_id,
        "weather_report": matchDetail.weather_report,
        "winner_team_id": matchDetail.winner_team_id,
      }

      await match.updateOne(
        { id: matchDetail.id },
        {
          $set: update,
          $inc:{
            isLineupUpdateCount:1
          }
        })
        .then(response => {
         })
        .catch(err => {
          console.log('err: livestats', err);


        })
    }


    let liveMatch = await getMatch().then(response => response)
    console.log('liveMatch: ', liveMatch);

    if (liveMatch && liveMatch.length === 0) {
      await AppStats.updateOne({}, {
        $set: {
          live: liveUpdate
        }
      }, { upsert: true }).then(response => response)
    } else {

      if (liveUpdate.length !== liveMatch.length) {
        liveMatch.forEach(matchId => {
          if (liveUpdate.indexOf(matchId) < 0) {
            instance.get(`/fixtures/${id.id}?api_token=${process.env.Access_key}&include=batting,batting.catchstump,batting.batsman,batting.bowler,bowling.team,bowling.bowler,scoreboards,scoreboards.team,lineup,batting.batsmanout`) //,balls.catchstump
              .then(response => {
                let matchDetail = response.data.data
                let update = {
                  "isLive": false,
                  "type": matchDetail.type,
                  "scoreboards": matchDetail.scoreboards,
                  "league": matchDetail.league,
                  "localteam": matchDetail.localteam,
                  "season": matchDetail.season,
                  "starting_at": matchDetail.starting_at,
                  "status": matchDetail.status,
                  "visitorteam": matchDetail.visitorteam,
                  "balls": matchDetail.balls,
                  "batting": matchDetail.batting,
                  "bowling": matchDetail.bowling,
                  "draw_noresult": matchDetail.draw_noresult,
                  "elected": matchDetail.elected,
                  "first_umpire_id": matchDetail.first_umpire_id,
                  "follow_on": matchDetail.follow_on,
                  "last_period": matchDetail.last_period,
                  "league_id": matchDetail.league_id,
                  "lineup": matchDetail.lineup,
                  "live": matchDetail.live,
                  "localteam_dl_data": matchDetail.localteam_dl_data,
                  "localteam_id": matchDetail.localteam_id,
                  "man_of_match_id": matchDetail.man_of_match_id,
                  "man_of_series_id": matchDetail.man_of_series_id,
                  "note": matchDetail.note,
                  "referee_id": matchDetail.referee_id,
                  "resource": matchDetail.resource,
                  "round": matchDetail.round,
                  "rpc_overs": matchDetail.rpc_overs,
                  "rpc_target": matchDetail.rpc_target,
                  "season_id": matchDetail.season_id,
                  "second_umpire_id": matchDetail.second_umpire_id,
                  "stage_id": matchDetail.stage_id,
                  "super_over": matchDetail.super_over,
                  "toss_won_team_id": matchDetail.toss_won_team_id,
                  "total_overs_played": matchDetail.total_overs_played,
                  "tv_umpire_id": matchDetail.tv_umpire_id,
                  "type": matchDetail.type,
                  "venue_id": matchDetail.venue_id,
                  "visitorteam_dl_data": matchDetail.visitorteam_dl_data,
                  "visitorteam_id": matchDetail.visitorteam_id,
                  "weather_report": matchDetail.weather_report,
                  "winner_team_id": matchDetail.winner_team_id,
                }
                sms(6003633574, `Update and dispatch match: ${matchDetail.visitorteam.code} vs ${matchDetail.localteam.code}`)

                match.updateOne(
                  { id: matchId },
                  {
                    $set: {
                      ...update,
                      isFinished: true,
                      isLive: false,
                      isCounting: true,
                      pending: true,
                      paid: false,
                    }
                  })
                  .then(response => {
                    AppStats.updateOne({}, {
                      $set: {
                        live: liveUpdate
                      }
                    }, { upsert: true }).then(response => resolve(true))
                  }).catch(err => {
                    console.log('err: sms(6003633574', err);

                  })

              }).catch(err => {
                reject(err);
              })
          }
        })
      }
    }







    console.log(`${chalk.yellow("liveUpdate Ended")}`)
  } catch (error) {
    console.log(error);

  }

}



const cronJob = require('cron').CronJob;

const job = new cronJob('*/60 * * * * *', function () {
  console.log(chalk.bgRed("Live Count job"));

  liveUpdate().then().catch()


})

job.start();
liveUpdate().then().catch()

const getMatch = () => new Promise((resolve, reject) => {
  AppStats.find({}).lean().then(response => {
    console.log('response: AppStats', response);

    resolve(response && response.length > 0 ? response[0].live : [])
  }).catch(err => {
    console.log('err: AppStats', err);
    reject(err)
  })
})
