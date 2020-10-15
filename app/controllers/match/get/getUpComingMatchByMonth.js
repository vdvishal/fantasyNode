const mongoose = require('mongoose');
const axios = require('axios')

const instance = axios.create({
    baseURL: process.env.API_URL,
  });

const getUpComing = (req, res) => {
   //2020-01-01,2020-11-01
   console.log(req.params);
   
    instance.get(
        `/fixtures?api_token=${process.env.Access_key}&include=league,season,visitorteam,localteam&sort=starting_at&filter[starts_between]=${req.params.start},${req.params.end}`)
    .then(response => {                
        res.status(200).json(response.data)
    }).catch(err => {
        console.log(err);
        
    })
  
}


module.exports = getUpComing