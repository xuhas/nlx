const axios = require("axios")
const FormData = require('form-data')
// A flag to know when start or stop the camera
var enabled = false;
// Use require to add webcamjs
var WebCamera = require("webcamjs");
var token = null
var myWorker = new Worker('worker.js');

var queue = []

async function getToken() {
    let response = await axios.post("https://api.wrnch.ai/v1/login", {
        "username": "loic294",
        "password": "6K01T2hwOeyV"
    })
    token = response.data.access_token
    console.log("TOKEN", token)

    myWorker.postMessage(["token",token]);
}



function processBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

enabled = true;
WebCamera.attach('#camdemo');

setInterval(captureImage, 1000)

function captureImage() {

    if(enabled && token) {
        WebCamera.snap(async function(data_uri) {
            // Save the image in a variable
            var imageBuffer = processBase64Image(data_uri);
            // image buffer

            // **** IMPORTANT: The image buffer is inversed!!!! *****
            console.log("IMAGE BUFFER", imageBuffer)

            let data = new FormData();
             data.append('media', imageBuffer.data, { filename : `${Date.now()}` });
             data.append('work_type', "json");
             data.append('hands', "true");

             console.log("DATA", data)
             console.log("TOKEN BEFORE", token)

            try {

                 let res = await axios.post("https://api.wrnch.ai/v1/jobs", data, 
                 {
                     headers: {
                         'Authorization': "Bearer " + token, 
                         'accept-language': 'en-CA,en-US;q=0.9,en;q=0.8',
                         'content-type': `multipart/form-data; boundary=${data._boundary}`,
                     }
                 })

                 console.log(res)

                 myWorker.postMessage(["job_id",res.data.job_id]);

            } catch (err) {
                console.error("ERR:", err)
            }

         });
    }
}


getToken()

