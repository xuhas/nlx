let axios = require("axios")
let queue = []
let token;

onmessage = function(e) {
    console.log('Message received from main script', e.data[0], e.data[1]);
    if (e.data[0] == "job_id") {
      queue.push(e.data[1])
      processQueue()
    }

    if (e.data[0] == "token") {
      token = e.data[1]
    }

    //console.log('Posting message back to main script');
    //postMessage(workerResult);
}

async function processQueue() {
  //for (var  of queue) {
  if (queue.length > 0) {
    const job_id = queue[0]
    console.log(job_id, token)
    try {
      let res = await axios.get(`https://api.wrnch.ai/v1/jobs/${job_id}`,
      {
        headers: {
          'Authorization': "Bearer " + token
        }
      })
      console.log(res.data)
      queue.shift()
    } catch(err) {
      console.log("NOT READY", err)
      processQueue()
    }
    
  //}
  }
}

