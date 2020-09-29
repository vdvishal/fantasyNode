const { Worker, isMainThread } = require('worker_threads');


const count = (req,res) => {
    try {
      
      console.log('=-=-=-=-=-=-=-=-=-=-=-',req.body);

    if (isMainThread) {
        console.log(req.body.id);
    const worker = new Worker(__dirname + "../../../../../app/workers/contestCompleteCalc.js", {workerData:{ id:req.body.id }});
 
    
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