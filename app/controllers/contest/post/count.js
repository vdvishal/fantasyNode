const { Worker, isMainThread } = require('worker_threads');

const mongoose = require('mongoose');
const Match = mongoose.model('Matches');


const count = async (req,res) => {
    try {
      
      console.log('=-=-=-=-=-=-=-=-=-=-=-',req.body);
     let m = await Match.findOne({
       
        id: parseInt(req.body.matchId)
        
        // isLive: true,isFinished:true
    }).lean().select("id paid").exec().then(matches => matches)
    console.log('m: ', m);
    if(m.paid && m.paid === true){
      res.status(202)
      return res.send({message:"Already paid"})
    }

    if (isMainThread) {
        console.log(req.body.id);
    const worker = new Worker(__dirname + "../../../../../app/workers/contestCompleteCalc.js", {workerData:{ id:req.body.matchId }});
 
    
    worker.on('error', (err) => { throw err; });
    worker.on('exit', () => {
      threads.delete(worker);
      console.log(`Thread exiting, ${threads.size} running...`);
      if (threads.size === 0) {
        console.log(primes.join('\n'));
      }
    })
    worker.on('message', (msg) => {
        console.log('msg: ', msg);
 
    });

  
}
  } catch (error) {
    console.log('error: ', error);
      
  }

res.send({message:"Counrt started"})
}

module.exports = count