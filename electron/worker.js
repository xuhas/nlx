let axios = require("axios")
let io = require("socket.io-client")
let { coordsToDirection, Points, Direction, HandsPosition } = require("./src/coordsToDirection")
let queue = []
let token;

const socket = io('http://localhost:3000');

socket.on('connect', function() {
  console.log("Socket Connected")
})

onmessage = function(e) {
    console.log('Message received from main script', e.data[0], e.data[1]);
    if (e.data[0] == "job_id") {
      queue.push(e.data[1])
      processQueue()
    }

    if (e.data[0] == "token") {
      token = e.data[1]
    }
}

async function processQueue() {
  //for (var  of queue) {
    console.log("PROCESSING QUEUE");
  if (queue.length > 0) {
    const job_id = queue[0]
    //console.log(job_id, token)
    try {
      let res = await axios.get(`https://api.wrnch.ai/v1/jobs/${job_id}`,
      {
        headers: {
          'Authorization': "Bearer " + token
        }
      })
      
      if (res.data && res.data.frames && res.data.frames[0].persons) {
        console.log(res.data.frames[0].persons.length)
        const hand = res.data.frames[0].persons.findWhere(p => p.hand_pose)
        console.log("HANDS DETECTED");
        if (hand.left && hand.right) {
          const leftHand = new Points(hand.left.bbox.minX, hand.left.bbox.minY)
          const rightHand = new Points(hand.right.bbox.minX, hand.right.bbox.minY)
          let handPosition = new HandsPosition(leftHand, rightHand)
          const output = coordsToDirection(handPosition)

          console.log("OUTPUT", output)

          if (output) socket.emit('transfer', output)
        }
      }
      queue.shift()

    } catch(err) {
      //console.log("NOT READY", err)
      processQueue()
    }
    
  //}
  }
}

