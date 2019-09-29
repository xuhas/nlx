// const axios = require("axios")
// const FormData = require('form-data')
//const handtrack = require('handtrackjs')
// A flag to know when start or stop the camera
// var enabled = false;
// var token = null
// var myWorker = new Worker('worker.js');

// var queue = []

// async function getToken() {
//     let response = await axios.post("https://api.wrnch.ai/v1/login", {
//         "username": "loic294",
//         "password": "6K01T2hwOeyV"
//     })
//     token = response.data.access_token

//     myWorker.postMessage(["token",token]);
// }

let { coordsToDirection, Points, Direction, HandsPosition } = require("./src/coordsToDirection")
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

console.log("COORS", coordsToDirection, Points, HandsPosition)

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {
        // console.log("Predictions: ", predictions);
        // predictions.map((p) => {
        //     console.log(p.bbox)
        // })


        if (predictions.length == 2) {
            const leftHand = new Points(predictions[0].bbox[0], predictions[0].bbox[1])
            const rightHand = new Points(predictions[1].bbox[0], predictions[1].bbox[1])
            let handPosition = new HandsPosition(leftHand, rightHand)
            const output = coordsToDirection(handPosition)

            console.log("OUTPUT", output)

            //if (output) socket.emit('transfer', output)
        }
    

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});

// function processBase64Image(dataString) {
//     var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};

//     if (matches.length !== 3) {
//         return new Error('Invalid input string');
//     }

//     response.type = matches[1];
//     response.data = new Buffer(matches[2], 'base64');

//     return response;
// }

// enabled = true;
// WebCamera.attach('#camdemo');

// setInterval(captureImage, 1000)

// function captureImage() {

//     if(enabled && token) {
//         WebCamera.snap(async function(data_uri) {
//             // Save the image in a variable
//             var imageBuffer = processBase64Image(data_uri);
//             // image buffer

//             // **** IMPORTANT: The image buffer is inversed!!!! *****x

//             let data = new FormData();
//              data.append('media', imageBuffer.data, { filename : `${Date.now()}` });
//              data.append('work_type', "json");
//              data.append('hands', "true");

//             // try {

//             //     //  let res = await axios.post("https://api.wrnch.ai/v1/jobs", data, 
//             //     //  {
//             //     //      headers: {
//             //     //          'Authorization': "Bearer " + token, 
//             //     //          'accept-language': 'en-CA,en-US;q=0.9,en;q=0.8',
//             //     //          'content-type': `multipart/form-data; boundary=${data._boundary}`,
//             //     //      }
//             //     //  })

//             //      //console.log(res)

//             //     //  myWorker.postMessage(["job_id",res.data.job_id]);

//             // } catch (err) {
//             //     console.error("ERR:", err)
//             // }

//          });
//     }
// }


//getToken()

