const mongoose = require('mongoose');
const axios = require('axios')
const _ = require('lodash')

const instance = axios.create({
    baseURL: process.env.API_URL,
  });

const getDetails = (req, res) => {
    console.log(req.query);

    instance.get(
        `/fixtures/${req.query.id}/?api_token=${process.env.Access_key}&include=league,season,visitorteam,localteam,lineup`)
    .then(response => {        
         let matchdata = response.data.data 
         console.log(matchdata);
            
         instance.get(
            `/teams/${matchdata.localteam_id}/squad/${matchdata.season.id}?api_token=${process.env.Access_key}&include=squad`) //`/teams/${matchdata.localteam_id}?api_token=${process.env.Access_key}&include=squad`)
        .then(response2 => {        
            let localteam =  (response2.data);
           
            let squad = localteam.data.squad

            squad = _.uniqBy(squad,'id')

 
            localteam.data.squad = _.orderBy(squad, function(e) { return e.firstname}, ['asc']);

            instance.get(
                `/teams/${matchdata.visitorteam_id}/squad/${matchdata.season.id}?api_token=${process.env.Access_key}&include=squad`)//`/teams/${matchdata.visitorteam_id}/?api_token=${process.env.Access_key}&include=squad`)   //${matchdata.visitorteam_id}/squad/${matchdata.season_id}/?api_token=${process.env.Access_key}`)
            .then(response3 => {        
                
                 let visitorteam =  (response3.data);
                 let squad2 = visitorteam.data.squad

                 squad2 = _.uniqBy(squad2,'id')
                 visitorteam.data.squad = _.orderBy(squad2, function(e) { return e.firstname}, ['asc']);
     
                res.status(200).json({data:matchdata,localteam,visitorteam})
            })
         })
     }).catch(err => {
         console.log(err);
         
     })
}


module.exports = getDetails